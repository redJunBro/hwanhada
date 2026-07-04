import requests
import gzip

# URL 설정
url = "https://qwer25.com/_services/service_games.php"
params = {"rand": "124932.73276394467"}

# 헤더 설정
headers = {
    "accept": "application/json, text/javascript, */*; q=0.01",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "origin": "https://qwer25.com",
    "referer": "https://qwer25.com/_views/1_game/game_list5.php",
    "sec-ch-ua": '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "x-requested-with": "XMLHttpRequest",
    "cookie": (
        "a10WebID4=s7vu238fk1rn3q6fe5ftfi25ma; "
        "token=YADalXUeOGfvSLNAVifRp%2BA%2Fa3LGSrgQrc2dAbI%3D; "
        "notice_ps_1731682800_43=off; notice_ps_1731682800_58=off; "
        "notice_ps_1731682800_37=off; notice_ps_1731682800_36=off; "
        "notice_ps_1731682800_50=off; notice_ps_1731682800_65=off; "
        "notice_ps_1731682800_61=off; notice_ps_1731682800_62=off; "
        "notice_ps_1731682800_64=off; notice_ps_1731682800_67=off"
    )
}

# POST 데이터 설정
data = {}

# 요청 보내기
response = requests.post(url, params=params, headers=headers, data=data)

# 응답 처리
print("Status Code:", response.status_code)

# Content-Type 확인
content_type = response.headers.get("Content-Type", "")
print("Content-Type:", content_type)

try:
    if "application/json" in content_type:
        # JSON 데이터 처리
        print("JSON Response:", response.json())
    elif "gzip" in response.headers.get("Content-Encoding", ""):
        # GZIP 압축 해제
        decoded_content = gzip.decompress(response.content).decode("utf-8")
        print("GZIP Decoded Response:", decoded_content)
    else:
        # 일반 텍스트 처리
        print("Text Response:", response.text)
except Exception as e:
    print("Error while processing response:", e)
