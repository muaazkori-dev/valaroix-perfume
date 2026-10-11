Add-Type -AssemblyName System.Drawing

$src = "C:\Users\Zubair Computer\.gemini\antigravity\brain\c44d21f6-904a-47f5-be6c-2a477ca26c60\.user_uploaded\media_1791722162984_8d2391ce.jpg"

# Copy full resolution to website & app assets
Copy-Item $src "public\logo.jpg" -Force
Copy-Item $src "public\customer-logo.jpg" -Force
Copy-Item $src "apps\customer_app\assets\images\logo.jpg" -Force
Copy-Item $src "apps\admin_app\assets\images\logo.jpg" -Force

# Convert to PNG for Flutter asset
$orig = [System.Drawing.Image]::FromFile($src)
$orig.Save("apps\customer_app\assets\images\logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$orig.Save("apps\admin_app\assets\images\logo.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Generate Mipmap densities for customer app icon (DP)
$densities = @{
    "apps\customer_app\android\app\src\main\res\mipmap-mdpi\ic_launcher.png" = 48
    "apps\customer_app\android\app\src\main\res\mipmap-hdpi\ic_launcher.png" = 72
    "apps\customer_app\android\app\src\main\res\mipmap-xhdpi\ic_launcher.png" = 96
    "apps\customer_app\android\app\src\main\res\mipmap-xxhdpi\ic_launcher.png" = 144
    "apps\customer_app\android\app\src\main\res\mipmap-xxxhdpi\ic_launcher.png" = 192
}

foreach ($target in $densities.Keys) {
    $dim = $densities[$target]
    $bmp = New-Object System.Drawing.Bitmap($dim, $dim)
    $graph = [System.Drawing.Graphics]::FromImage($bmp)
    $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graph.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graph.DrawImage($orig, 0, 0, $dim, $dim)
    $bmp.Save($target, [System.Drawing.Imaging.ImageFormat]::Png)
    $graph.Dispose()
    $bmp.Dispose()
}

$orig.Dispose()
Write-Host "Official logo processed for all customer app icons & assets successfully!"
