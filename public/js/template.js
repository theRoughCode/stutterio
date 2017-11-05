const INTRO_SCREEN_TEMPLATE = document.querySelector('#intro-screen-template').innerHTML;
const INPUT_SCRIPT_TEMPLATE = document.querySelector('#input-script-template').innerHTML;
const LOADING_SCREEN = document.querySelector('#loading-screen').innerHTML;

function swapTemplates(template, params = null) {
  const body = document.querySelector('.body');
  body.innerHTML = template;

  if (template === INTRO_SCREEN_TEMPLATE) {
    document.querySelector('#record-btn').addEventListener('keypress', e => {
      var key = e.which || e.keyCode;
      if (key === 13) handleRecord();
    });

    if (params) {
      const words = document.querySelector('.words');
      words.innerHTML = params.text;
    }
  } else if (template === INPUT_SCRIPT_TEMPLATE) {
    document.addEventListener('keydown', e => {
      var key = e.which || e.keyCode;
      if (e.ctrlKey && key === 13) handleSubmit();
    });
  }
}
