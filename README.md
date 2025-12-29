# TU-Dortmund-Raumreservierung-tui
Automatisiertes Tool zur Reservierung von Lernräumen der Fakultät Informatik an der TU Dortmund mit Puppeter und Typescript.
Interaktiv wählt das Tool Datum, Raum und Zeitfenster aus und reserviert den Raum automatich über die Webseite.

## 🛠 Voraussetzungen
- [Node.js](nodejs.org) v18+
- npm
- Fakultät-Mailaccount oder Fakultät-Poolaccount

## 💾 Installation
1. Repository klonen:
```bash
git clone https://github.com/schanver/tu-dortmund-raumreservierung-tui.git
cd  tu-dortmund-raumreservierung-tui
```
2. Abhängigkeiten installieren:
```bash
npm install
```
3.`.env`-Datei bearbeiten
```env
USERNAME=                   #Fakultäts-Mailaccount (ohne @cs.tu-dortmund.de) oder Fakultäts-Poolaccount 
PASSWORD=                   #dein Passwort
DEBUG=                      #für Debugging
```
4. Das Programm ausführen:
```bash
npm run start
```
## ⚡ Entwicklung
Projekt im Entwicklungsmodus starten:
```bash
npm run dev
```

## 📦 Build & Produktion
1. Typescript in Javascript kompilieren:
```bash
npm run build
```
or:
```bash
tsc
```
2. Kompilierten Code ausführen:
```bash
npm start
```

# LIZENZ
[LICENSE](./LICENSE.md)



