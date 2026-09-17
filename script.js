const teamInput = document.getElementById('teamInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const teamCard = document.getElementById('teamCard');

const teamBadge = document.getElementById('teamBadge');
const teamName = document.getElementById('teamName');
const teamFormedYear = document.getElementById('teamFormedYear');
const stadiumName = document.getElementById('stadiumName');
const stadiumCapacity = document.getElementById('stadiumCapacity');
const stadiumLocation = document.getElementById('stadiumLocation');
const teamDescription = document.getElementById('teamDescription');
const socialLinks = document.getElementById('socialLinks');

searchBtn.addEventListener('click', buscarTime);

teamInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        buscarTime();
    }
});

async function buscarTime() {
    const nomeTime = teamInput.value.trim();

    if (!nomeTime) {
        exibirErro("Por favor, digite o nome de um time.");
        return;
    }

    esconderTudo();
    loading.classList.remove('hidden');

    const url = `https://www.thesportsdb.com/api/v1/json/123/searchteams.php?t=${encodeURIComponent(nomeTime)}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Erro na requisição da API.");
        }

        const data = await response.json();

        if (!data.teams || data.teams.length === 0) {
            exibirErro("Nenhum time encontrado. Verifique o nome digitado.");
            return;
        }

        const time = data.teams[0];
        preencherDados(time);

    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        exibirErro("Ocorreu um erro ao buscar as informações. Tente novamente mais tarde.");
    } finally {
        loading.classList.add('hidden');
    }
}

function preencherDados(time) {
    teamBadge.src = time.strTeamBadge || 'https://via.placeholder.com/120?text=Sem+Escudo';
    teamBadge.alt = `Escudo do ${time.strTeam}`;
    teamName.textContent = time.strTeam || 'Não informado';
    teamFormedYear.textContent = time.intFormedYear ? `Fundado em ${time.intFormedYear}` : 'Ano de fundação indisponível';

    stadiumName.textContent = time.strStadium || 'Não informado';
    stadiumCapacity.textContent = time.intStadiumCapacity 
        ? Number(time.intStadiumCapacity).toLocaleString('pt-BR') 
        : 'Não informada';
    stadiumLocation.textContent = time.strLocation || 'Não informada';

    teamDescription.textContent = time.strDescriptionPT || time.strDescriptionEN || 'Sem descrição disponível.';

    socialLinks.innerHTML = '';
    
    if (time.strWebsite) criarLinkSocial('Website', `https://${time.strWebsite}`);
    if (time.strFacebook) criarLinkSocial('Facebook', `https://${time.strFacebook}`);
    if (time.strTwitter) criarLinkSocial('Twitter / X', `https://${time.strTwitter}`);
    if (time.strInstagram) criarLinkSocial('Instagram', `https://${time.strInstagram}`);

    if (socialLinks.children.length === 0) {
        socialLinks.innerHTML = '<span>Nenhuma rede social cadastrada.</span>';
    }

    teamCard.classList.remove('hidden');
}

function criarLinkSocial(texto, url) {
    const a = document.createElement('a');
    a.href = url.startsWith('http') ? url : `https://${url}`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = texto;
    socialLinks.appendChild(a);
}

function exibirErro(mensagem) {
    esconderTudo();
    errorMessage.textContent = mensagem;
    errorMessage.classList.remove('hidden');
}

function esconderTudo() {
    loading.classList.add('hidden');
    errorMessage.classList.add('hidden');
    teamCard.classList.add('hidden');
}
