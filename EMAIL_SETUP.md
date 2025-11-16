# Konfigurimi i Email-it për Rezervime

Për të aktivizuar dërgimin e email-it në **drilonrexhaja6@gmail.com** kur dikush bën një rezervim, ju duhet të konfiguroni një nga metodat e mëposhtme:

## Metoda 1: Web3Forms (Rekomanduar - Më e lehtë)

1. Shkoni në https://web3forms.com/
2. Klikoni "Get Started" ose "Get Your Access Key"
3. Vendosni email-in tuaj: **drilonrexhaja6@gmail.com**
4. Merreni Access Key-n tuaj
5. Hapni `script.js` dhe zëvendësoni `YOUR_WEB3FORMS_ACCESS_KEY` me key-n tuaj në linjën 146

**Kjo metodë funksionon menjëherë dhe nuk kërkon konfigurim të komplikuar!**

## Metoda 2: EmailJS

1. Shkoni në https://www.emailjs.com/ dhe krijoni një llogari falas
2. Klikoni "Add New Service" dhe zgjidhni Gmail (ose email provider-in tuaj)
3. Krijoni një Email Template me këto variabla:
   - `{{from_name}}` - Emri i klientit
   - `{{from_email}}` - Email i klientit
   - `{{phone}}` - Telefoni
   - `{{package}}` - Paketa e zgjedhur
   - `{{date}}` - Data e rezervuar
   - `{{time}}` - Ora e rezervuar
   - `{{participants}}` - Numri i pjesëmarrësve
   - `{{message}}` - Mesazhi (nëse ka)
4. Merreni:
   - Public Key (nga Account Settings)
   - Service ID (nga service që krijuat)
   - Template ID (nga template që krijuat)
5. Hapni `script.js` dhe zëvendësoni:
   - `YOUR_PUBLIC_KEY` në linjën 42
   - `YOUR_SERVICE_ID` në linjën 128
   - `YOUR_TEMPLATE_ID` në linjën 128

## Testimi

Pas konfigurimit, testoni formularin e rezervimit dhe kontrolloni nëse merrni email në **drilonrexhaja6@gmail.com**.

**Shënim:** Nëse nuk konfiguroni asnjë metodë, të dhënat do të shfaqen në Console të browser-it për testim.

