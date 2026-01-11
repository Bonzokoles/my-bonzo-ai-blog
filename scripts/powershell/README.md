# PowerShell Scripts

PowerShell automation scripts for the MyBonzo AI Blog project.

## Scripts

- `auto_import.ps1` - Automated import script for Windows
- `smart-dashboard.ps1` - Smart dashboard utilities

## Usage

### Prerequisites
- PowerShell 5.1 or higher
- Windows environment or PowerShell Core on Linux/Mac

### Running Scripts
```powershell
# Example: Run auto import
.\scripts\powershell\auto_import.ps1

# Example: Launch smart dashboard
.\scripts\powershell\smart-dashboard.ps1
```

## Execution Policy

If you encounter execution policy errors:
```powershell
# Check current policy
Get-ExecutionPolicy

# Set policy (run as Administrator)
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Cross-Platform

For cross-platform support, consider using PowerShell Core:
```bash
# Install PowerShell Core on Linux/Mac
# See: https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell
```
