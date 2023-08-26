from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound, TranscriptsDisabled
from pytube import YouTube
import boto3
import json

def has_official_subs(video_id: str) -> bool:
    try:
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        return not transcript_list.find_manually_created_transcript(["en"]).is_generated
    except (NoTranscriptFound, TranscriptsDisabled):
        return False


def lambda_handler(event, context):
    event = event["body"]

    search_tokens = [event["token"].lower()]
    video_id = event["id"]
    is_exact_match = event["isExactMatch"]

    if not is_exact_match:
        tokens_split = search_tokens[0].split()
        search_tokens = search_tokens + tokens_split if len(tokens_split) != 1 else search_tokens
    res = has_official_subs(video_id)

    token_dict = {}

    full_transcript = ""

    if res:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        for item in transcript:
            full_transcript += item["text"] + " "
            for token in search_tokens:
                temp = item["text"].lower().replace("\n", " ")
                if token in temp:
                    if token not in token_dict:
                        token_dict[token] = [item["start"]]
                    else:
                        token_dict[token] += [item["start"]]
        full_transcript = full_transcript.replace("\n", " ")
        full_transcript = full_transcript.replace("'", "\'")
        full_transcript = full_transcript.replace("\"", "\\\"")
        return {
            "statusCode": 200,
            "body": {
                "dict": token_dict,
                "transcript": full_transcript
            },
            "headers": {
                "Access-Control-Allow-Origin": "*"
            }
        }
    else:
        s3_client = boto3.client('s3')
        file_name = f'video-{video_id}.mp4'
        job_name = f'{video_id}-transcribe'
        bucket_objects = s3_client.list_objects(Bucket="bucket-samhui")
        file_exists = False
        transcript_exists = False

        for object in bucket_objects["Contents"]:
            print(object["Key"])
            if object["Key"] == file_name:
                file_exists = True
            if object["Key"] == f'{video_id}-transcript.json':
                transcript_exists = True
            if file_exists and transcript_exists:
                break

        print(file_exists)
        print(transcript_exists)

        if not file_exists:
            print("Starting download")
            yt = YouTube(f'https://youtube.com/watch?v={video_id}').streams.get_highest_resolution()
            yt.download(output_path="/tmp", filename=file_name)
            s3_client.upload_file(f'/tmp/{file_name}', "bucket-samhui", file_name)

        if not transcript_exists:
            transcript_client = boto3.client('transcribe')
            transcript_client.start_transcription_job(
                TranscriptionJobName=job_name,
                LanguageCode="en-US",
                MediaFormat="mp4",
                Media={"MediaFileUri": f's3://bucket-samhui/{file_name}'},
                OutputBucketName="bucket-samhui",
                OutputKey=f'{video_id}-transcript.json')
            while transcript_client.get_transcription_job(TranscriptionJobName=job_name)["TranscriptionJob"]["TranscriptionJobStatus"] in ["QUEUED", "IN_PROGRESS"]:
                print("Ongoing...")
            transcript_client.delete_transcription_job(TranscriptionJobName=job_name)

        s3_client.download_file(Bucket="bucket-samhui", Key=f'{video_id}-transcript.json', Filename=f'/tmp/{video_id}-transcript.json')

        with open(f'/tmp/{video_id}-transcript.json') as f:
            transcript_dict = json.load(f)
            full_transcript = transcript_dict["results"]["transcripts"][0]["transcript"]
            for item in transcript_dict["results"]["items"]:
                word = item["alternatives"][0]["content"].lower()
                if word in search_tokens:
                    if word in token_dict:
                        token_dict[word] += [item["start_time"]]
                    else:
                        token_dict[word] = [item["start_time"]]

        return {
            "statusCode": 200,
            "body": {
                "dict": token_dict,
                "transcript": full_transcript
            },
            "headers": {
                "Access-Control-Allow-Origin": "*"
            }
        }
