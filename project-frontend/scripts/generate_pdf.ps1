Param(
    [string]$Input = "docs/frontend_documentation.md",
    [string]$Output = "docs/frontend_documentation.pdf"
)

if (-not (Get-Command pandoc -ErrorAction SilentlyContinue)) {
    Write-Error "pandoc not found in PATH. Install pandoc from https://pandoc.org/installing.html"
    exit 2
}

$fullInput = Join-Path -Path (Split-Path -Path $PSScriptRoot -Parent) -ChildPath $Input
if (-not (Test-Path $fullInput)) {
    $fullInput = Join-Path -Path $PSScriptRoot -ChildPath $Input
}

pandoc $fullInput -o $Output --pdf-engine=xelatex --metadata title="TechKhor Frontend Documentation"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Output "PDF written to $Output"
