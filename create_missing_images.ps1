$imgDir = "c:\Users\Pietro\Desktop\SDCardChecker\img\devices"

# List of missing images
$missingImages = @(
    "sony-a6700.webp",
    "fujifilm-x-s20.webp",
    "dji-mini-3-pro.webp",
    "nintendo-switch-lite.webp",
    "sony-a7iv.webp",
    "dji-pocket-3.webp",
    "samsung-tab-s9.webp",
    "canon-r6-mk2.webp",
    "dash-cam.webp",
    "dji-air-3.webp",
    "nikon-z8.webp",
    "panasonic-s1h.webp",
    "gopro-hero-11.webp",
    "fire-hd-10.webp",
    "fire-max-11.webp",
    "hp-chromebook-14.webp"
)

# Use existing placeholder as template
$templateFile = Join-Path $imgDir "placeholder.webp"

foreach ($missingImage in $missingImages) {
    $targetPath = Join-Path $imgDir $missingImage
    if (-not (Test-Path $targetPath)) {
        Copy-Item -Path $templateFile -Destination $targetPath
        Write-Host "Created: $missingImage"
    } else {
        Write-Host "Already exists: $missingImage"
    }
}

Write-Host "Done!"
