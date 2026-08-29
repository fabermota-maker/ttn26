$root = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:5500/")
$listener.Start()
Write-Host "Nataleluia LP → http://127.0.0.1:5500/"
while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $rel = [Uri]::UnescapeDataString($ctx.Request.Url.LocalPath.TrimStart('/'))
    if ([string]::IsNullOrWhiteSpace($rel)) { $rel = "index.html" }
    $file = [IO.Path]::GetFullPath((Join-Path $root $rel))
    if (-not $file.StartsWith($root, [StringComparison]::OrdinalIgnoreCase)) {
        $ctx.Response.StatusCode = 403
        $ctx.Response.Close()
        continue
    }
    if (Test-Path $file -PathType Container) { $file = Join-Path $file "index.html" }
    if (Test-Path $file -PathType Leaf) {
        $bytes = [IO.File]::ReadAllBytes($file)
        $ext = [IO.Path]::GetExtension($file).ToLower()
        $ctype = switch ($ext) {
            '.html' { 'text/html; charset=utf-8' }
            '.css'  { 'text/css' }
            '.js'   { 'application/javascript' }
            '.json' { 'application/json' }
            '.png'  { 'image/png' }
            '.jpg'  { 'image/jpeg' }
            '.jpeg' { 'image/jpeg' }
            '.webp' { 'image/webp' }
            '.svg'  { 'image/svg+xml' }
            '.mp4'  { 'video/mp4' }
            '.webm' { 'video/webm' }
            '.md'   { 'text/markdown; charset=utf-8' }
            '.jsx'  { 'text/plain; charset=utf-8' }
            '.mjs'  { 'text/javascript; charset=utf-8' }
            default { 'application/octet-stream' }
        }
        $ctx.Response.Headers['Accept-Ranges'] = 'bytes'
        $ctx.Response.ContentType = $ctype
        $range = $ctx.Request.Headers['Range']
        if ($range -match 'bytes=(\d*)-(\d*)') {
            $start = if ($Matches[1]) { [int64]$Matches[1] } else { 0 }
            $end = if ($Matches[2]) { [int64]$Matches[2] } else { $bytes.Length - 1 }
            if ($end -ge $bytes.Length) { $end = $bytes.Length - 1 }
            $len = $end - $start + 1
            $ctx.Response.StatusCode = 206
            $ctx.Response.Headers['Content-Range'] = "bytes $start-$end/$($bytes.Length)"
            $ctx.Response.ContentLength64 = $len
            $ctx.Response.OutputStream.Write($bytes, $start, $len)
        } else {
            $ctx.Response.ContentLength64 = $bytes.Length
            $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
        }
    } else {
        $ctx.Response.StatusCode = 404
    }
    $ctx.Response.Close()
}
