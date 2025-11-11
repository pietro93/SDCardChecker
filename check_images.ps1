$json = Get-Content "c:\Users\Pietro\Desktop\SDCardChecker\data\devices.json" | ConvertFrom-Json
$imgDir = "c:\Users\Pietro\Desktop\SDCardChecker\img\devices"

$existingImages = Get-ChildItem -Path $imgDir -Name

Write-Host "Checking image URLs in devices.json..."
Write-Host ""

$missingImages = @()
$foundImages = @()

foreach ($device in $json.devices) {
    $imagePath = $device.imageUrl.Replace("/img/devices/", "")
    $fullPath = Join-Path $imgDir $imagePath
    
    if ($imagePath -notmatch "placeholder") {
        if ($existingImages -contains $imagePath) {
            $foundImages += @{
                Device = $device.name
                Image = $imagePath
                Status = "OK"
            }
        } else {
            $missingImages += @{
                Device = $device.name
                ImageURL = $device.imageUrl
                ImageFile = $imagePath
            }
        }
    } else {
        Write-Host "PLACEHOLDER: $($device.name) -> $imagePath"
    }
}

if ($missingImages.Count -gt 0) {
    Write-Host ""
    Write-Host "MISSING IMAGE FILES:"
    foreach ($missing in $missingImages) {
        Write-Host "  $($missing.Device)"
        Write-Host "    -> $($missing.ImageFile)"
    }
} else {
    Write-Host "All image files found!"
}

Write-Host ""
Write-Host "Total devices: $($json.devices.Count)"
Write-Host "Images OK: $($foundImages.Count)"
if ($missingImages.Count -gt 0) {
    Write-Host "Missing: $($missingImages.Count)"
}
