# Server Endpoint: 
    https://studio-app.snapchat.com/vc/v1/reporting/lens

# Curl Request: 
    curl -H "Host: studio-app.snapchat.com" -H "User-Agent: SnapCamera/1.21.0.0 (Windows 11 Version 2009)" -H "Content-Type: application/json" -H "X-Installation-Id: default" -H "Origin: https://localhost/" -H "Accept-Language: en-US,*" --data-binary "{\"context\":\"test report\",\"lens_id\":\"111111111111111111\",\"reason_id\":\"report_lens_reason_this_lens_is_inappropriate\"}" --compressed "https://studio-app.snapchat.com/vc/v1/reporting/lens"

# Server Response:
    empty response
