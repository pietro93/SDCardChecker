$json = Get-Content 'data\devices.json' -Raw | ConvertFrom-Json

foreach($device in $json.devices) {
    if($device.category -eq 'Gaming Consoles') {
        $device.category = 'Gaming Handhelds'
    }
}

$json | ConvertTo-Json -Depth 100 | Set-Content 'data\devices.json'
