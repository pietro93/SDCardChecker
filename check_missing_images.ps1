$json = Get-Content "c:\Users\Pietro\Desktop\SDCardChecker\data\devices.json" -Raw | ConvertFrom-Json
$basePath = "c:\Users\Pietro\Desktop\SDCardChecker"

$missing = @()

foreach ($dev in $json.devices) {
    $imgUrl = $dev.imageUrl
    $filePath = $basePath + $imgUrl.Replace("/", "\")
    
    if (-not (Test-Path $filePath)) {
        $missing += [PSCustomObject]@{
            id = $dev.id
            name = $dev.name
            category = $dev.category
            imageUrl = $imgUrl
            filePath = $filePath
        }
    }
}

Write-Host "Total devices with missing images: $($missing.Count)" -ForegroundColor Red

$missing | Sort-Object category | ForEach-Object {
    Write-Host "$($_.id) - $($_.name) [$($_.category)]" -ForegroundColor Yellow
    Write-Host "  URL: $($_.imageUrl)"
}

Write-Host ""
Write-Host "Summary by category:"
$missing | Group-Object category | ForEach-Object {
    Write-Host "$($_.Name): $($_.Count) missing"
}
