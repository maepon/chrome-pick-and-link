document.addEventListener('DOMContentLoaded', () => {
  const rulesContainer = document.getElementById('rules-container');
  const addRuleButton = document.getElementById('add-rule');
  const saveButton = document.getElementById('save-settings');
  const exportButton = document.getElementById('export-settings');
  const importButton = document.getElementById('import-settings-button');
  const importInput = document.getElementById('import-settings');

  // Load saved rules
  chrome.storage.sync.get(['rules'], (data) => {
    const rules = data.rules || [];
    rules.forEach((rule) => addRuleToUI(rule));
  });

  // Add a new rule to the UI
  function addRuleToUI(rule = {}) {
    const ruleDiv = document.createElement('div');
    ruleDiv.className = 'rule';

    ruleDiv.innerHTML = `
    <dl>
      <dt><label>Title:</label></dt>
      <dd><input type="text" class="rule-title" value="${rule.title || ''}" placeholder="Rule Title"></dd>

      <dt><label>URL Pattern (Regex):</label></dt>
      <dd><input type="text" class="rule-url-pattern" value="${rule.urlPattern || ''}" placeholder="e.g., https?:\\/\\/example\\.com\\/.*"></dd>

      <dt><label>Code Pattern (Regex):</label></dt>
      <dd><input type="text" class="rule-code-pattern" value="${rule.codePattern || ''}" placeholder="e.g., \\d{4}"></dd>

      <dt><label>Output URL Template:</label></dt>
      <dd><textarea class="rule-url-template" placeholder="e.g., https://example.com/?q={placeholder}">${rule.urlTemplate || ''}</textarea>
      <button class="insert-placeholder button-lite">Insert {placeholder}</button></dd>
    </dl>

    <div>
    <button class="delete-rule">Delete Rule</button>
    </div>
    `;

    const deleteButton = ruleDiv.querySelector('.delete-rule');
    deleteButton.addEventListener('click', () => {
      rulesContainer.removeChild(ruleDiv);
    });

    rulesContainer.appendChild(ruleDiv);
  }

  // Add a new rule when the button is clicked
  addRuleButton.addEventListener('click', () => {
    addRuleToUI();
  });

  // Save all rules
  saveButton.addEventListener('click', () => {
    const rules = [];
    const ruleDivs = rulesContainer.querySelectorAll('.rule');

    ruleDivs.forEach((ruleDiv) => {
      const title = ruleDiv.querySelector('.rule-title').value;
      const urlPattern = ruleDiv.querySelector('.rule-url-pattern').value;
      const codePattern = ruleDiv.querySelector('.rule-code-pattern').value;
      const urlTemplate = ruleDiv.querySelector('.rule-url-template').value;

      // Validate inputs
      if (!title || !urlPattern || !codePattern || !urlTemplate) {
        alert('All fields are required for each rule.');
        return;
      }

      rules.push({ title, urlPattern, codePattern, urlTemplate });
    });

    chrome.storage.sync.set({ rules }, () => {
      alert('Rules saved!');
    });
  });

  // Export settings as YAML
  exportButton.addEventListener('click', () => {
    chrome.storage.sync.get(['rules'], (data) => {
      const rules = data.rules || [];
      const yamlContent = `# Pick And Link Settings\n` +
        jsyaml.dump({ rules });

      const blob = new Blob([yamlContent], { type: 'text/yaml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pick-code-link-settings.yaml';
      a.click();
      URL.revokeObjectURL(url);
    });
  });

  // Trigger file input for importing settings
  importButton.addEventListener('click', () => {
    importInput.click();
  });

  // Import settings from YAML
  importInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const data = jsyaml.load(content);

        if (data && Array.isArray(data.rules)) {
          chrome.storage.sync.get(['rules'], (existingData) => {
            const existingRules = existingData.rules || [];

            // Merge rules: overwrite rules with the same title, keep others
            const mergedRules = [...existingRules];
            data.rules.forEach((newRule) => {
              const index = mergedRules.findIndex((rule) => rule.title === newRule.title);
              if (index !== -1) {
                mergedRules[index] = newRule; // Overwrite existing rule
              } else {
                mergedRules.push(newRule); // Add new rule
              }
            });

            chrome.storage.sync.set({ rules: mergedRules }, () => {
              alert('Settings imported successfully!');
              location.reload();
            });
          });
        } else {
          alert('Invalid YAML format.');
        }
      } catch (error) {
        alert('Error parsing YAML file.');
      }
    };
    reader.readAsText(file);
  });

  // Add placeholder button functionality dynamically to each rule
  rulesContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('insert-placeholder')) {
      const textarea = event.target.previousElementSibling;
      if (textarea && textarea.classList.contains('rule-url-template')) {
        const cursorPosition = textarea.selectionStart;
        const textBefore = textarea.value.substring(0, cursorPosition);
        const textAfter = textarea.value.substring(cursorPosition);
        textarea.value = `${textBefore}{placeholder}${textAfter}`;
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = cursorPosition + 12; // Move cursor after {placeholder}
      }
    }
  });
});