# Script to update relatedDevices for all devices in devices.json
# Groups devices by category and related functionality

$json = Get-Content "c:\Users\Pietro\Desktop\SDCardChecker\data\devices.json" -Raw | ConvertFrom-Json

# Define related devices groupings based on category and use case
$relatedDevicesMap = @{
    # Action Cameras (GoPro)
    "gopro-hero-13" = @("gopro-hero-12", "gopro-hero-11-black", "gopro-hero-max", "insta360-x3")
    "gopro-hero-12" = @("gopro-hero-13", "gopro-hero-11-black", "gopro-hero-max")
    "gopro-hero-11-black" = @("gopro-hero-13", "gopro-hero-12", "gopro-hero-max")
    "gopro-hero-max" = @("gopro-hero-13", "gopro-hero-12", "insta360-x3")
    
    # DJI Drones
    "dji-mini-4-pro" = @("dji-mini-3-pro", "dji-air-3", "dji-air-3s", "dji-mavic-3")
    "dji-mini-3-pro" = @("dji-mini-4-pro", "dji-air-3", "dji-air-3s")
    "dji-air-3" = @("dji-air-3s", "dji-mavic-3", "dji-mini-4-pro")
    "dji-air-3s" = @("dji-air-3", "dji-mavic-3", "dji-mini-4-pro")
    "dji-mavic-3" = @("dji-air-3s", "dji-air-3", "dji-osmo-pocket-3")
    
    # DJI Action Cameras
    "dji-osmo-pocket-3" = @("gopro-hero-13", "insta360-x3", "dji-mini-4-pro")
    
    # Nintendo Gaming
    "nintendo-switch" = @("nintendo-switch-oled", "nintendo-switch-lite", "steam-deck", "asus-rog-ally")
    "nintendo-switch-oled" = @("nintendo-switch", "nintendo-switch-lite", "steam-deck")
    "nintendo-switch-lite" = @("nintendo-switch", "nintendo-switch-oled", "steam-deck")
    
    # PC Gaming
    "steam-deck" = @("nintendo-switch", "asus-rog-ally", "nintendo-switch-oled")
    "asus-rog-ally" = @("steam-deck", "nintendo-switch-oled", "nintendo-switch")
    
    # Mirrorless Cameras - Canon
    "canon-eos-r5" = @("canon-eos-r6-mark-ii", "nikon-z9", "nikon-z8", "sony-a7-iv")
    "canon-eos-r6-mark-ii" = @("canon-eos-r5", "sony-a7-iv", "nikon-z8")
    
    # Mirrorless Cameras - Sony
    "sony-a6700" = @("sony-a7-iv", "fujifilm-x-s20", "canon-eos-r6-mark-ii")
    "sony-a7-iv" = @("canon-eos-r6-mark-ii", "sony-a6700", "nikon-z8", "nikon-z9")
    
    # Mirrorless Cameras - Fujifilm
    "fujifilm-x-s20" = @("sony-a6700", "sony-a7-iv", "canon-eos-r6-mark-ii")
    
    # Mirrorless Cameras - Nikon
    "nikon-z9" = @("nikon-z8", "canon-eos-r5", "sony-a7-iv", "panasonic-lumix-s1h")
    "nikon-z8" = @("nikon-z9", "canon-eos-r5", "sony-a7-iv")
    
    # Cinema Cameras
    "bmpcc-4k" = @("bmpcc-6k-pro", "canon-eos-r5", "panasonic-lumix-s1h")
    "bmpcc-6k-pro" = @("bmpcc-4k", "panasonic-lumix-s1h", "canon-eos-r5")
    "panasonic-lumix-s1h" = @("nikon-z9", "bmpcc-6k-pro", "bmpcc-4k")
    
    # 360 Cameras
    "insta360-x3" = @("gopro-hero-max", "gopro-hero-13", "dji-osmo-pocket-3")
    
    # Dash Cameras (replaced dash-cam-v3)
    "viofo-a229-duo" = @("nextbase-622gw", "wyze-cam-v3", "eufy-solocam-s340")
    "nextbase-622gw" = @("viofo-a229-duo", "wyze-cam-v3", "eufy-solocam-s340")
    
    # Security Cameras
    "wyze-cam-v3" = @("eufy-solocam-s340", "viofo-a229-duo", "nextbase-622gw")
    "eufy-solocam-s340" = @("wyze-cam-v3", "viofo-a229-duo", "nextbase-622gw")
    
    # Tablets & Computing
    "amazon-fire-hd-10" = @("amazon-fire-max-11", "samsung-galaxy-tab-s9", "raspberry-pi-5")
    "amazon-fire-max-11" = @("amazon-fire-hd-10", "samsung-galaxy-tab-s9")
    "samsung-galaxy-tab-s9" = @("amazon-fire-hd-10", "amazon-fire-max-11")
    "raspberry-pi-5" = @("amazon-fire-hd-10", "amazon-fire-max-11")
    "hp-chromebook-14" = @("amazon-fire-hd-10", "samsung-galaxy-tab-s9")
}

# Update all devices
foreach ($device in $json.devices) {
    if ($relatedDevicesMap.ContainsKey($device.id)) {
        $device.relatedDevices = $relatedDevicesMap[$device.id]
        Write-Host "Updated: $($device.name) -> $($device.relatedDevices.Count) related"
    } else {
        Write-Host "No mapping for: $($device.id)"
    }
}

# Save the updated JSON
$json | ConvertTo-Json -Depth 100 | Set-Content "c:\Users\Pietro\Desktop\SDCardChecker\data\devices.json"
Write-Host ""
Write-Host "Complete! All relatedDevices have been updated."
