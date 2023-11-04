import subprocess
import json


def make_email_content(data):
    return (
            "Title:\n"
            + data["versions"]["0"]["title"]
            + "\n\nURL:\n"
            + data["url"]
            + "\n\nKey Message:\n"
            + data["key_message"]
            + "\n\nTopics:\n"
            + f"{data['tags'][0]}, {data['tags'][1]}, and {data['tags'][2]}"
            + f"\n\nNeutrality: {data['neutrality'] * 100}%"
    )


def send_analysis_mail(address, data):
    input_data = {
        "addresses": address,
        "emailSubject": "Analysis of your requested article is here!",
        "emailContent": make_email_content(data),
    }
    script_path = "../mail_service/app/sendEmail.js"
    command = ["node", script_path, json.dumps(input_data)]
    return subprocess.run(command)  # , capture_output=True, text=True)