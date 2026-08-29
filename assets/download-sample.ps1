$ErrorActionPreference = 'Stop'
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$urls = @(
  'https://www.figma.com/api/mcp/asset/4a032ce8-74ab-4643-9b5f-e3962a876a35',
  'https://www.figma.com/api/mcp/asset/bb876530-f949-4d2a-a59e-ec165112a7db',
  'https://www.figma.com/api/mcp/asset/026234e9-392c-4aca-9bda-dd73459162a1'
)
foreach ($u in $urls) {
  $id = ($u -split '/')[-1]
  $out = Join-Path $dir ($id + '.bin')
  Invoke-WebRequest -Uri $u -OutFile $out -UseBasicParsing
}
Get-ChildItem $dir -File | Select-Object Name, Length
