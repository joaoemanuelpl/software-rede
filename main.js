const ipOrigem = "192.168.1.10";

function ipParaBinario(ip) {
  return ip.split('.').map(oct => (+oct).toString(2).padStart(8, '0')).join('');
}

function binarioParaIp(bin) {
  return bin.match(/.{8}/g).map(b => parseInt(b, 2)).join('.');
}

function gerarMascara(bits) {
  return '1'.repeat(bits).padEnd(32, '0');
}

function formatarBinarioEmOctetos(bin) {
  return bin.match(/.{8}/g).join('.');
}

function validarIP(ip) {
  const octetos = ip.split('.');
  if (octetos.length !== 4) return false;
  return octetos.every(oct => {
    const num = parseInt(oct);
    return !isNaN(num) && num >= 0 && num <= 255;
  });
}

function verificar() {
  const bitsInput = document.getElementById('bits').value.trim();
  const ipDestino = document.getElementById('ipDestino').value.trim();
  const resultado = document.getElementById('resultado');
  resultado.className = '';

  const bits = parseInt(bitsInput);
  if (!bitsInput || isNaN(bits) || bits < 1 || bits > 32) {
    resultado.innerText = "⚠️ Máscara inválida! Digite um número entre 1 e 32.";
    resultado.classList.add('error');
    return;
  }

  if (!ipDestino || !validarIP(ipDestino)) {
    resultado.innerText = "⚠️ IP de destino inválido! Use o formato XXX.XXX.XXX.XXX (0-255).";
    resultado.classList.add('error');
    return;
  }

  const maskBin = gerarMascara(bits);
  const maskDecimal = binarioParaIp(maskBin);
  const maskBinFormatada = formatarBinarioEmOctetos(maskBin);

  const origemBin = ipParaBinario(ipOrigem);
  const destinoBin = ipParaBinario(ipDestino);

  const redeOrigemBin = origemBin.split('').map((b, i) => b & maskBin[i]).join('');
  const redeDestinoBin = destinoBin.split('').map((b, i) => b & maskBin[i]).join('');

  const redeOrigemDecimal = binarioParaIp(redeOrigemBin);
  const redeDestinoDecimal = binarioParaIp(redeDestinoBin);

  if (redeOrigemBin === redeDestinoBin) {
    resultado.classList.add('success');
    resultado.innerHTML = `
      <b>Máscara:</b><br>
      Decimal: ${maskDecimal} <br>
      Binário: <code>${maskBinFormatada}</code><br><br>
      <b>Redes calculadas:</b><br>
      Origem: ${redeOrigemDecimal}<br>
      Destino: ${redeDestinoDecimal}<br><br>
      ✅ O IP está na <b>mesma rede</b>.
    `;
  } else {
    resultado.classList.add('error');
    resultado.innerHTML = `
      <b>Máscara:</b><br>
      Decimal: ${maskDecimal} <br>
      Binário: <code>${maskBinFormatada}</code><br><br>
      <b>Redes calculadas:</b><br>
      Origem: ${redeOrigemDecimal}<br>
      Destino: ${redeDestinoDecimal}<br><br>
      ❌ O IP <b>NÃO</b> está na mesma rede.
    `;
  }
}
