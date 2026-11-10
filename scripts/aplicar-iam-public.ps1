# aplicar-iam-public.ps1
# Concede 'allUsers' como Cloud Run Invoker a las 6 functions de Condor Sky.
# Necesario porque firebase-tools no propaga la opcion invoker:"public"
# al IAM de Cloud Run en functions v2 callable.
#
# Requisitos:
#   - gcloud CLI instalado y autenticado: gcloud auth login
#   - Permisos de Owner o Editor en el proyecto caidalibre-prod.
#
# Uso:
#   .\aplicar-iam-public.ps1

$ErrorActionPreference = "Stop"

$project = "caidalibre-prod"
$region = "us-central1"
$services = @(
    "crearbooking",
    "generateboldhash",
    "boldwebhook",
    "consultarbooking",
    "setadminclaim",
    "guardarconfigbold"
)

Write-Host "Aplicando IAM allUsers como Cloud Run Invoker..." -ForegroundColor Cyan

foreach ($svc in $services) {
    Write-Host ""
    Write-Host "-> $svc" -ForegroundColor Yellow
    gcloud run services add-iam-policy-binding $svc `
        --region=$region `
        --member="allUsers" `
        --role="roles/run.invoker" `
        --project=$project
}

Write-Host ""
Write-Host "Listo. Probar la reserva en https://caidalibre-prod.web.app/reservar" -ForegroundColor Green
