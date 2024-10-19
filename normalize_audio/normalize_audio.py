import os

originalFile = "../public/videos"
outputDir = "./normalized"

# Crear la carpeta si no existe
os.makedirs(outputDir, exist_ok=True)

names = [f for f in os.listdir(originalFile)]

for name in names:
    print(f"Normalizando {name}")
    os.system(f'ffmpeg-normalize "{originalFile}/{name}" -o "{outputDir}/{name}" -c:a aac -b:a 192k --keep-loudness-range-target')
    print("Listo")
