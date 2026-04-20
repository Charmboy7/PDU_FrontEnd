import os
import re

base = "d:/PDU/frontend/src/styles"
compo = f"{base}/components"

os.makedirs(base, exist_ok=True)
os.makedirs(compo, exist_ok=True)

variables_css = """
:root {
  /* Updated Background Hierarchy */
  --bg-main: #0f1b2d;
  --bg-header: #0d1726;
  --bg-card: #162334;
  --bg-input: #1b2a3f;
  
  /* Borders and Contrast */
  --border-color: #2a3b52;
  --border-focus: #3b82f6;
  
  /* Typography */
  --text-primary: #ffffff;
  --text-muted: #cbd5e1;
  --text-label: #94a3b8;
  
  /* Actions */
  --action-primary: #3b82f6;         /* default blue */
  --action-primary-hover: #60a5fa;   /* brighter hover */
  --action-secondary-border: #475569;
  
  /* Feedback */
  --error: #f87171; /* softened red */
}
"""

theme_css = """
@import './variables.css';

body {
  background-color: var(--bg-main) !important;
  color: var(--text-primary) !important;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  min-height: 100vh;
  margin: 0; 
}

/* Header Specific Component Styling */
.app-header {
  background-color: var(--bg-header);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.app-header .logo {
  font-weight: 900;
  font-size: 1.25rem;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.app-header .title {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1.1rem;
}
.app-header .subtitle {
  color: var(--text-muted);
  font-size: 0.85rem;
}
"""

wizard_css = """
/* Custom Card Container */
.wizard-container {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.4);
  /* no top margin if we want it to flow naturally below header, or just minimal */
  margin-top: 1.5rem; 
}
"""

input_css = """
.form-control, .form-select {
  background-color: var(--bg-input) !important;
  border: 1px solid var(--border-color) !important;
  color: var(--text-primary) !important;
  border-radius: 6px;
  padding: 0.6rem 1rem;
  transition: all 0.2s ease-in-out;
}

.form-control:focus, .form-select:focus {
  border-color: var(--border-focus) !important;
  box-shadow: 0 0 0 1px var(--border-focus) !important;
  background-color: #1f2f47 !important; /* slight brighten on focus */
  outline: none;
}

.form-control::placeholder {
  color: #64748b !important;
}

/* Force Form Select dropdown arrow to be white instead of default dark */
.form-select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e") !important;
}

/* Invalid State */
.form-control.is-invalid, .form-select.is-invalid {
  border-color: var(--error) !important;
}
"""

form_css = """
.form-label {
  color: var(--text-label);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.invalid-feedback {
  color: var(--error);
  font-size: 0.8rem;
  margin-top: 4px;
}

/* Radio Buttons */
.form-check-input {
  background-color: var(--bg-input);
  border-color: var(--border-color);
}
.form-check-input:checked {
  background-color: var(--action-primary);
  border-color: var(--border-focus);
}
.form-check-label {
  color: var(--text-primary);
  opacity: 0.9;
}
"""

button_css = """
/* Form Action Buttons */
.wizard-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.btn-wizard-primary {
  background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 2rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-wizard-primary:hover:not(:disabled) {
  background: linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%);
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.4);
  color: white;
}

.btn-wizard-primary:disabled {
  background: #2a3b52;
  color: #64748b;
  cursor: not-allowed;
}

.btn-wizard-secondary {
  background-color: transparent;
  color: var(--text-primary);
  border: 1px solid var(--action-secondary-border);
  border-radius: 6px;
  padding: 0.6rem 2rem;
  transition: all 0.2s;
}

.btn-wizard-secondary:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: var(--text-muted);
}

.btn-wizard-secondary:disabled {
  border-color: var(--action-secondary-border);
  color: #4A5568;
  cursor: not-allowed;
  opacity: 0.6;
}
"""

index_css = """
@import './styles/theme.css';
"""

with open(f"{base}/variables.css", 'w') as f: f.write(variables_css.strip() + '\\n')
with open(f"{base}/theme.css", 'w') as f: f.write(theme_css.strip() + '\\n')
with open(f"{compo}/wizard.css", 'w') as f: f.write(wizard_css.strip() + '\\n')
with open(f"{compo}/input.css", 'w') as f: f.write(input_css.strip() + '\\n')
with open(f"{compo}/form.css", 'w') as f: f.write(form_css.strip() + '\\n')
with open(f"{compo}/button.css", 'w') as f: f.write(button_css.strip() + '\\n')

with open("d:/PDU/frontend/src/index.css", 'w') as f: f.write(index_css.strip() + '\\n')

# Add imports to React components
def prepend(filepath, impt):
    with open(filepath, 'r') as f: content = f.read()
    if impt not in content:
        with open(filepath, 'w') as f:
            f.write(impt + "\\n" + content)

prepend("d:/PDU/frontend/src/components/Wizard.jsx", "import '../styles/components/wizard.css';")
prepend("d:/PDU/frontend/src/components/FormButton.jsx", "import '../styles/components/button.css';")
prepend("d:/PDU/frontend/src/components/FormInput.jsx", "import '../styles/components/input.css';\\nimport '../styles/components/form.css';")
prepend("d:/PDU/frontend/src/components/FormSelect.jsx", "import '../styles/components/input.css';\\nimport '../styles/components/form.css';")
prepend("d:/PDU/frontend/src/components/FormRadioGroup.jsx", "import '../styles/components/form.css';")
prepend("d:/PDU/frontend/src/pages/ContactInfo.jsx", "import '../styles/components/button.css';")
prepend("d:/PDU/frontend/src/pages/VoltagePower.jsx", "import '../styles/components/button.css';")
prepend("d:/PDU/frontend/src/pages/SummaryQuote.jsx", "import '../styles/components/button.css';")

print("Styling refactored successfully")
