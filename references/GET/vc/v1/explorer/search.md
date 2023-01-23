# Server Endpoint: 
    https://studio-app.snapchat.com/vc/v1/explorer/lenses

# Curl Request: 
    curl -H "Host: studio-app.snapchat.com" -H "User-Agent: SnapCamera/1.21.0.0 (Windows 11 Version 2009)" -H "Content-Type: application/json" -H "X-Installation-Id: default" -H "Origin: https://localhost/" -H "Accept-Language: en-US,*" --data-binary "{\"lenses\":[60115820875]}" --compressed "https://studio-app.snapchat.com/vc/v1/explorer/lenses"


# Server Response:
    {"lenses":[{"unlockable_id":"60115820875","snapcode_url":"https://snapcodes.storage.googleapis.com/png/9f0b0619-1852-31af-b853-6f6fa18faaa2_320_d2876207-2ffb-45c3-811b-9c2cd39bf2bd.png","user_display_name":"Snap Inc.","lens_name":"Time Machine","lens_status":"Live","deeplink":"https://www.snapchat.com/unlock/?type=SNAPCODE&uuid=b657396588b24c03a652bba60424b668&metadata=01","icon_url":"https://lens-storage.storage.googleapis.com/png/a74af906aeb44337b5cea7f17325c106","thumbnail_media_poster_url":"https://community-lens.storage.googleapis.com/preview-media/thumbnail_poster/4b3d872a-0bda-4991-84a9-fccdcdc05b81.jpg","standard_media_url":"https://community-lens.storage.googleapis.com/preview-media/final/4b3d872a-0bda-4991-84a9-fccdcdc05b81.mp4","standard_media_poster_url":"https://community-lens.storage.googleapis.com/preview-media/final_poster/4b3d872a-0bda-4991-84a9-fccdcdc05b81.jpg","image_sequence":{"url_pattern":"https://community-lens.storage.googleapis.com/preview-media/thumbnail_seq/4b3d872a-0bda-4991-84a9-fccdcdc05b81/image_%d.jpg","size":6,"frame_interval_ms":300}}]}
