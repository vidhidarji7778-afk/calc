(() => {
  const display = document.getElementById('display');
  const keys = document.querySelector('.keys');

  let current = '0';

  function updateDisplay() {
    display.value = current;
  }

  function clearAll() {
    current = '0';
    updateDisplay();
  }

  function deleteLast() {
    if (current.length <= 1) {
      current = '0';
    } else {
      current = current.slice(0, -1);
    }
    updateDisplay();
  }

  function appendValue(val) {
    if (current === '0' && val !== '.') {
      current = val;
    } else {
      // prevent multiple decimals in same number
      if (val === '.') {
        const parts = current.split(/[\+\-\*\/]/);
        const last = parts[parts.length - 1];
        if (last.includes('.')) return;
      }
      current += val;
    }
    updateDisplay();
  }

  function compute() {
    try {
      // allow only digits, operators, parentheses, decimals and spaces
      if (!/^[0-9+\-*/().\s]+$/.test(current)) {
        throw new Error('Invalid expression');
      }
      // Evaluate safely with Function
      const result = Function('"use strict"; return (' + current + ')')();
      current = String(result);
      updateDisplay();
    } catch (e) {
      current = 'Error';
      updateDisplay();
      setTimeout(clearAll, 1200);
    }
  }

  keys.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    if (btn.classList.contains('number')) {
      appendValue(btn.dataset.value);
      return;
    }

    if (btn.classList.contains('operator')) {
      // avoid consecutive operators (except minus for negative)
      if (/[+\-*/]$/.test(current) && btn.dataset.value !== '-') {
        // replace last operator
        current = current.slice(0, -1) + btn.dataset.value;
      } else {
        current += btn.dataset.value;
      }
      updateDisplay();
      return;
    }

    if (btn.classList.contains('decimal')) {
      appendValue('.');
      return;
    }

    const action = btn.dataset.action;
    if (action === 'clear') clearAll();
    else if (action === 'delete') deleteLast();
    else if (action === 'equals') compute();
  });

  // Keyboard support
  window.addEventListener('keydown', (e) => {
    const key = e.key;
    if (/^[0-9]$/.test(key)) {
      appendValue(key);
      e.preventDefault();
      return;
    }
    if (key === '.') { appendValue('.'); e.preventDefault(); return; }
    if (key === '+' || key === '-' || key === '*' || key === '/') {
      // map * and / directly; display shows × and ÷ but we store * and /
      appendValue(key);
      e.preventDefault();
      return;
    }
    if (key === 'Enter' || key === '=') { compute(); e.preventDefault(); return; }
    if (key === 'Backspace') { deleteLast(); e.preventDefault(); return; }
    if (key === 'Escape') { clearAll(); e.preventDefault(); return; }
    // parentheses
    if (key === '(' || key === ')') { appendValue(key); e.preventDefault(); return; }
  });

  // initialize
  updateDisplay();
})();