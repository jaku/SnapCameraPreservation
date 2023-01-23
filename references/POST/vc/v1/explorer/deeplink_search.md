# Server Endpoint: 
    https://studio-app.snapchat.com/vc/v1/explorer/deeplink_search

# Curl Request: 
    curl -H "Host: studio-app.snapchat.com" -H "User-Agent: SnapCamera/1.21.0.0 (Windows 11 Version 2009)" -H "Content-Type: application/json" -H "X-Installation-Id: default" -H "Origin: https://localhost/" -H "Accept-Language: en-US,*" --data-binary "{\"deeplink\":\"https://www.snapchat.com/unlock/?type=SNAPCODE&uuid=5b7d3c2feb494021bb969c4063d0e074&metadata=01\"}" --compressed "https://studio-app.snapchat.com/vc/v1/explorer/deeplink_search"

# Server Response:
```json
{"lenses":[{"unlockable_id":"36918620875","snapcode_url":"https://snapcodes.storage.googleapis.com/png/119dc900-89b3-3906-bd5b-7101e7713d95_320_d7e579a6-9934-4075-b09d-4ff3887089d1.png","user_display_name":"Shonuff74","lens_name":"BLUE TIGER CAP","lens_status":"Live","deeplink":"https://www.snapchat.com/unlock/?type=SNAPCODE&uuid=5b7d3c2feb494021bb969c4063d0e074&metadata=01","icon_url":"https://lens-storage.storage.googleapis.com/png/6b8f54d6-5cf3-4ca5-b8b6-3d53ca317346","thumbnail_media_poster_url":"https://community-lens.storage.googleapis.com/preview-media/thumbnail_poster/13d3becb-5cc2-4684-91c4-ca7f66cd10ac.jpg","standard_media_url":"https://community-lens.storage.googleapis.com/preview-media/final/13d3becb-5cc2-4684-91c4-ca7f66cd10ac.mp4","standard_media_poster_url":"https://community-lens.storage.googleapis.com/preview-media/final_poster/13d3becb-5cc2-4684-91c4-ca7f66cd10ac.jpg","image_sequence":{"url_pattern":"https://community-lens.storage.googleapis.com/preview-media/thumbnail_seq/13d3becb-5cc2-4684-91c4-ca7f66cd10ac/image_%d.jpg","size":6,"frame_interval_ms":300},"obfuscated_user_slug":"NEOMExwRU8_qvEeYLQxXiw"}]}```
