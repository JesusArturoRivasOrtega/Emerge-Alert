(() => {
  const page = document.querySelector('[data-detector]');
  if (!page) return;

  const configs = {
    heridas: {
      title: 'heridas',
      model: 'https://teachablemachine.withgoogle.com/models/EZKfHnpb-/',
      threshold: .68,
      advice: {
        'heridas superficiales': { title: 'Herida superficial (orientativo)', text: 'Lávate las manos, enjuaga con agua limpia y aplica presión directa si hay sangrado. Cubre con un apósito limpio. Busca atención si la herida es profunda, está sucia, fue causada por mordedura o no deja de sangrar.' },
        'heridas penetrantes': { title: 'Herida penetrante (orientativo)', text: 'No retires objetos incrustados. Aplica presión alrededor de la lesión con material limpio y solicita valoración médica urgente, especialmente si el sangrado es abundante o la herida es profunda.' }
      }
    },
    quemaduras: {
      title: 'quemaduras',
      model: 'https://teachablemachine.withgoogle.com/models/7Ss89zpc9/',
      threshold: .68,
      advice: {
        'grado 1': { title: 'Quemadura leve (orientativo)', text: 'Enfría con agua corriente fresca; no uses hielo. Protege la zona sin apretar. Consulta si afecta una zona extensa, cara, manos, pies, articulaciones o genitales.' },
        'grado 2': { title: 'Quemadura con posible ampolla (orientativo)', text: 'Enfría con agua corriente fresca y cubre con gasa o tela limpia. No revientes ampollas ni apliques remedios caseros. Requiere valoración si es extensa o afecta zonas delicadas.' },
        'grado 3': { title: 'Posible quemadura grave (orientativo)', text: 'Busca atención de emergencia. No retires ropa pegada, no apliques cremas ni hielo y cubre suavemente con una tela limpia. Llama al 911 si es extensa, eléctrica, química o hay dificultad respiratoria.' }
      }
    },
    mpox: {
      title: 'lesiones cutáneas',
      model: 'https://teachablemachine.withgoogle.com/models/oHzF0aOWQ/',
      threshold: .7,
      advice: {
        'posible viruela del mono': { title: 'Resultado no diagnóstico', text: 'Una imagen no puede confirmar mpox. Si tienes una erupción nueva o inexplicable, evita contacto cercano, cubre lesiones y consulta a un profesional de salud para una evaluación y prueba adecuada.' },
        'posible viruela comun': { title: 'Resultado no diagnóstico', text: 'Una imagen no puede distinguir de forma confiable entre condiciones de la piel. Evita automedicarte y busca valoración profesional, especialmente si hay fiebre, dolor intenso o lesiones que se extienden.' }
      }
    }
  };

  const config = configs[page.dataset.detector];
  const elements = {
    webcam: document.querySelector('#webcam-container'),
    placeholder: document.querySelector('[data-camera-placeholder]'),
    start: document.querySelector('[data-start-detector]'),
    stop: document.querySelector('[data-stop-detector]'),
    className: document.querySelector('[data-prediction-class]'),
    confidence: document.querySelector('[data-prediction-confidence]'),
    bar: document.querySelector('[data-confidence-bar]'),
    message: document.querySelector('[data-result-message]'),
    status: document.querySelector('[data-camera-status]')
  };
  let model;
  let webcam;
  let running = false;
  let animationFrame;

  const normalized = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
  const present = (className, probability) => {
    const confidence = Math.round(probability * 100);
    elements.className.textContent = className;
    elements.confidence.textContent = `Confianza del modelo: ${confidence}%`;
    elements.bar.style.width = `${confidence}%`;
    const result = config.advice[normalized(className)];
    if (probability >= config.threshold && result) {
      elements.message.innerHTML = `<strong>${result.title}</strong><p>${result.text}</p>`;
    } else {
      elements.message.innerHTML = '<strong>Resultado no concluyente</strong><p>La imagen no ofrece suficiente certeza. No uses el resultado para tomar decisiones médicas; consulta a un profesional ante dolor, sangrado, fiebre o preocupación.</p>';
    }
  };

  const predict = async () => {
    if (!running || !model || !webcam) return;
    webcam.update();
    const predictions = await model.predict(webcam.canvas);
    const best = predictions.reduce((selected, item) => item.probability > selected.probability ? item : selected, predictions[0]);
    if (best) present(best.className, best.probability);
    animationFrame = window.requestAnimationFrame(predict);
  };

  const stop = () => {
    running = false;
    window.cancelAnimationFrame(animationFrame);
    webcam?.stop();
    webcam = undefined;
    elements.webcam.innerHTML = '';
    elements.placeholder.hidden = false;
    elements.status.textContent = 'Cámara detenida';
    elements.start.disabled = false;
    elements.start.textContent = 'Iniciar cámara';
    elements.stop.hidden = true;
  };

  const start = async () => {
    if (running) return;
    elements.start.disabled = true;
    elements.start.textContent = 'Preparando…';
    elements.status.textContent = 'Solicitando permiso';
    try {
      if (!window.tmImage) throw new Error('La biblioteca del modelo no se cargó.');
      if (!model) {
        elements.status.textContent = 'Cargando modelo';
        model = await window.tmImage.load(`${config.model}model.json`, `${config.model}metadata.json`);
      }
      webcam = new window.tmImage.Webcam(360, 360, true);
      await webcam.setup();
      await webcam.play();
      elements.webcam.appendChild(webcam.canvas);
      elements.placeholder.hidden = true;
      elements.status.textContent = 'Analizando de forma local';
      elements.start.textContent = 'Cámara activa';
      elements.stop.hidden = false;
      running = true;
      predict();
    } catch (error) {
      elements.status.textContent = 'No se pudo iniciar la cámara';
      elements.start.disabled = false;
      elements.start.textContent = 'Reintentar cámara';
      elements.message.innerHTML = '<strong>No fue posible acceder a la cámara</strong><p>Revisa los permisos del navegador y usa una conexión segura (localhost o HTTPS). La herramienta no envía imágenes desde esta página.</p>';
      stop();
    }
  };

  elements.start.addEventListener('click', start);
  elements.stop.addEventListener('click', stop);
  window.addEventListener('beforeunload', stop);
})();
