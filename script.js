const meteoIcons = {
    "Rain": "fa-cloud-rain",
    "Clouds": "fa-cloud",
    "Clear": "fa-sun",
    "Snow": "fa-snowflake",
    "Fog": "fa-cloud-fog",
    "Drizzle": "fa-cloud-drizzle",
};

function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}

async function main(withIP = true) {
    let ip;
    let ville;
    const apiKey ="  // clé API ipstack";

    if (withIP) {
        // 1. Récupérer l'adresse IP du PC qui ouvre la page
        try {
            let reponse = await fetch('https://api.ipify.org?format=json');
            let data = await reponse.json();
            ip = data.ip;
            console.log(ip);
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'adresse IP:', error);
        }

        // 2. Récupérer la ville grâce à l'adresse IP
        try {
            let reponse = await fetch(`https://api.ipstack.com/${ip}?access_key=${apiKey}`);
            let data = await reponse.json();
            ville = data.city;
            console.log(ville);
        } catch (error) {
            console.error('Erreur lors de la récupération des informations de géolocalisation:', error);
        }
    } else {
        ville = document.querySelector('#ville').textContent;
    }

    // 3. Récupérer les infos météo grâce à la ville
    const weatherApiKey =  "// clé API OpenWeatherMap";

    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=${weatherApiKey}&units=metric`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données météo');
        }
        let data = await response.json();
        console.log(data);

        // 4. Afficher les informations sur la page
        afficherMeteoInfos(data);
    } catch (error) {
        console.error('Erreur:', error.message);
    }
}


// fonction pour afficher les infos sur la page
function afficherMeteoInfos(data) {
    const name = data.name;
    const temperature = data.main.temp;
    const conditions = data.weather[0].main;
    const description = data.weather[0].description;


    document.querySelector('#ville').textContent = name;
    document.querySelector('#temperature').textContent = Math.round(temperature);
    document.querySelector('#conditions').textContent = capitalize(description);

    // affichage de l'arriere plan en fonction du temps
    const bodyElement = document.querySelector('body');
    bodyElement.className = meteoIcons[conditions] || '';

    // affichage de l'icon en fonction du temps
    const iconElement = document.querySelector('i.fa-solid');
    iconElement.className = `fa-solid ${meteoIcons[conditions] || 'fa-question'}`;
}


//  rentre editable la partie  nom de la ville
const ville = document.querySelector('#ville');

ville.addEventListener('click', () => {
    ville.contentEditable = true;
});

ville.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        e.preventDefault();
        ville.contentEditable = false;
        main(false);
    }
});

main();
