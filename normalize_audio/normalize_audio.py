import os

orginalFile = "../public/videos"

names = [f for f in os.listdir(orginalFile)]

for name in names:
    print(f"Normalizando {name}")
    os.system(f'ffmpeg-normalize "{orginalFile}/{name}" -o "./normalized/{name}" -c:a aac -b:a 192k --keep-loudness-range-target')
    print(f"Listo")
