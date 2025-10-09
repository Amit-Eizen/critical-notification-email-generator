# 📧 Critical Notification Email Generator

A simple web tool for generating Critical Notification emails with customizable templates.

---

## ✨ Features

- **Two Template Types**: Report delays and system issues
- **Live Preview**: See your email in real-time as you type
- **Auto Date Formatting**: Converts dates to "October 2nd" format
- **GMT Auto-Detection**: Automatically detects GMT+2/GMT+3 based on DST
- **One-Click Copy**: Copy formatted email directly to clipboard

---

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Amit-Eizen/critical-notification-email-generator.git
   cd critical-notification-email-generator
   ```

2. **Open `index.html` in your browser**
   - That's it! No installation needed.

3. **Optional: Run with local server**
   ```bash
   python -m http.server 8000
   # Then open http://localhost:8000
   ```

---

## 📖 How to Use

### For Report Delays:
1. Select **Report Delay** template
2. Choose environment (NCEL, NHL, VAL, etc.)
3. Enter ticket number
4. Select report name and date
5. Choose Opening or Resolved
6. Click **Copy Email to Clipboard**
7. Paste in Outlook and send

### For System Issues:
1. Select **System Issue** template
2. Choose environment and ticket number
3. Select issue description
4. Add start time (optional) and root cause
5. Choose Opening or Resolved
6. Click **Copy Email to Clipboard**
7. Paste in Outlook and send

---

## 📁 Project Structure

```
critical-notification-email-generator/
├── index.html              # Main page
├── styles.css              # Styling
├── js/
│   ├── main.js            # App initialization
│   ├── utils.js           # Date/time utilities
│   ├── templateGenerator.js # Email templates
│   └── formHandlers.js    # Form logic
└── images/
    ├── banner-opening.png  # Orange banner
    └── banner-resolved.png # Green banner
```

---

## 🛠️ Built With

- **HTML5** - Structure
- **CSS3** - Styling  
- **Vanilla JavaScript** - Logic (no frameworks)

---

## 🎨 Customization

**Add new issue types:**  
Edit `index.html` → Add option to Issue Description dropdown

**Add new environments:**  
Edit `index.html` → Add option to Environment dropdown

**Change email templates:**  
Edit `js/templateGenerator.js` → Modify the relevant function

**Replace banners:**  
Replace images in `images/` folder

---

## 📝 License

MIT License - Feel free to use and modify

---

**Built for streamlining NOC notification workflows** 🚀
