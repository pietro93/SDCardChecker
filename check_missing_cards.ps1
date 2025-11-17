$devices = Get-Content 'data\devices.json' -Raw | ConvertFrom-Json
$sdcards = (Get-Content 'data\sdcards.json' | ConvertFrom-Json).sdcards
$existingIds = $sdcards.id | Sort-Object -Unique

$referencedCards = @{}
$devices.devices | ForEach-Object {
  if ($_.recommendedBrands) {
    $_.recommendedBrands | ForEach-Object {
      $cardId = $_.id
      if ($cardId -notin $referencedCards.Keys) {
        $referencedCards[$cardId] = $true
      }
    }
  }
}

$missing = @()
$referencedCards.Keys | ForEach-Object {
  if ($_ -notin $existingIds) {
    $missing += $_
  }
}

if ($missing.Count -gt 0) {
  Write-Host "MISSING SD CARDS:" -ForegroundColor Red
  $missing | Sort-Object
  Write-Host "Total missing: $($missing.Count)" -ForegroundColor Red
} else {
  Write-Host "All referenced cards exist in sdcards.json" -ForegroundColor Green
}
