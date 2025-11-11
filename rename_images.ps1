Set-Location "c:\Users\Pietro\Desktop\SDCardChecker\img\devices"

$mapping = @{
    "bmpcc-4k.webp" = "blackmagic-pocket-cinema-camera-4k.webp"
    "bmpcc-6k-pro.webp" = "blackmagic-pocket-cinema-camera-6k-pro.webp"
    "dji-mavic.webp" = "dji-mavic-3.webp"
    "dji-mini.webp" = "dji-mini-4-pro.webp"
    "gopro-placeholder.webp" = "gopro-hero-12.webp"
    "camera-placeholder.webp" = "canon-eos-r5.webp"
    "drone-placeholder.webp" = "dji-air-3s.webp"
    "valve-steam-deck.webp" = "steam-deck.webp"
}

foreach ($shortName in $mapping.Keys) {
    $fullName = $mapping[$shortName]
    if (Test-Path $shortName) {
        Rename-Item -Path $shortName -NewName $fullName -Force
        Write-Host "Renamed: $shortName -> $fullName"
    } else {
        Write-Host "File not found: $shortName"
    }
}

Write-Host "Done!"
