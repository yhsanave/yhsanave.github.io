const title = '@Yhsanave';
const titlePalettes = [
    ['#e28c00', '#e28c00', '#eccd00', '#eccd00', '#ffffff', '#62aedc', '#62aedc', '#203856', '#203856']
];
const titlePalette = _.sample(titlePalettes);


const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-=+[]\\/:<>;{}|~?';
const randChar = () => characters.charAt(Math.floor(rand(characters.length)));

const links = [
    {id: 'discord', href: 'https://discord.com/users/195694396115648512', text: ['Discord']},
    {id: 'twitter', href: 'https://twitter.yhsanave.me', text: ['Twitter']},
    {id: 'youtube', href: 'https://youtube.yhsanave.me/', text: ['You','Tube']},
    {id: 'anilist', href: 'https://anilist.yhsanave.me/', text: ['Ani','List']},
    {id: 'libib', href: 'https://yhsanave.libib.com/', text: ['Manga']},
    {id: 'steam', href: 'https://steamcommunity.com/id/yhsanave/', text: ['Steam']},
    {id: 'github', href: 'https://github.com/yhsanave', text: ['Github']},
    {id: 'mail', href: 'mailto:yhsanave@yhsanave.me', text: ['Email']},
    {id: 'venmo', href: 'https://venmo.yhsanave.me/', text: ['Venmo']},
    {id: 'paypal', href: 'https://paypal.yhsanave.me/', text: ['Pay','Pal']},
    {id: 'mastodon', href: 'https://mastodon.yhsanave.me/', text: ['Mastodon']},
    {id: 'tumblr', href: 'https://tumblr.yhsanave.me/', text: ['Tumblr']},
    {id: 'soundcloud', href: 'https://soundcloud.yhsanave.me/', text: ['SoundCloud']},
    {id: 'osu', href: 'https://osu.ppy.sh/users/7559714', text: ['osu!']},
    {id: 'prsk', copyText: '367762770000629763', text: ['PRSK:367762770000629763']},
    {id: 'switch', copyText: 'SW-0834-7237-5116', text: ['Switch:', 'SW-0834-7237-5116']}
];
const linkLength = (link) => link.text.join('').length;

const minRows = links.length+1;
const minColumns = Math.max(...links.map(l => linkLength(l)));
const magicGrid = {rows: minRows, columns: minColumns};

const sleep = ms => new Promise(r => setTimeout(r, ms));
const rand = (max, min=0) => Math.random() * (max - min) + min;
const spanify = (str) => Array.from(str).map(c => $('<span>').text(c));

const mutationFrequency = 100; // Magic text update frequency in milliseconds
const mutationFactor = .02; // Percent of cells to update each cycle
const getMutations = () => Math.floor(magicGrid.rows * magicGrid.columns * mutationFactor);
const updateInterval = setInterval(() => mutate(getMutations()), mutationFrequency);

function buildLink(link, row, col) {   
    let $elem = $(`<a id="link-${link.id}" class="magic-link"></a>`);
    if (link.href) $elem.prop({'href': link.href, 'target': '_blank'});
    if (link.copyText) { $elem.click(() => navigator.clipboard.writeText(link.copyText)); $elem.prop({'title': 'Click to Copy'}) };
    link.text.forEach((s, index) => {
        let charSpans = spanify(s);
        charSpans.forEach((sp, i) => {
            $elem.append($(sp)
                .addClass(`char link-char sublink-${index}`)
                .css({'--row': row, '--col': col+i+(link.text[index-1]?.length ?? 0)})
                .hide()
            );
        });
    });
    return $elem;
}

function buildGrid() {
    let wrapper = $('#magicWrapper');
    magicGrid.rows = Math.max(Math.floor(wrapper.innerHeight() / $('#scaleChar').height())-1, minRows);
    magicGrid.columns = Math.max(Math.floor(wrapper.innerWidth() / $('#scaleChar').width())-1, minColumns);
    wrapper.css('--rows', magicGrid.rows);
    wrapper.css('--columns', magicGrid.columns);

    let linkSpacing = (magicGrid.rows-1) / links.length;
    let linkPositions = {1: {start: 1, end: title.length+1}}; // Initialized with the position of the title
    links.forEach((link, index) => {
        let row = Math.ceil(linkSpacing * (index + 1));
        let col = Math.floor(rand(magicGrid.columns - linkLength(link) - 1) + 1);
        let $link = buildLink(link, row, col);
        wrapper.append($link);
        linkPositions[row] = {start: col, end: col+linkLength(link)};
    });
    
    for (let row = 1; row<=magicGrid.rows; row++) {
        for (let col = 1; col<=magicGrid.columns; col++) {
            if (col >= linkPositions[row]?.start && col < linkPositions[row]?.end) {
                col = linkPositions[row]?.end-1;
                continue;
            }
            wrapper.append(
                $(`<span class='char magic-char'>${randChar()}</span>`)
                .css({'--row': row, '--col': col})
                .hide()
            );
        }
    }
}

function mutate(strength) {
    let chars = _.sampleSize($('.magic-char'), strength);
    chars.forEach((char) => char.innerHTML = randChar());
}

async function animateIn() {
    await sleep(1000);
    await animateTitleIn();
    await sleep(500);
    $('#scaleChar').hide();
    await animateMagicTextIn(5, 1000);
}

async function animateTitleIn() {
    for (let i = 0; i < title.length; i++) {
        let titleChar = $(`<span id="title_${i}">${title[i]}</span>`).css({'color': titlePalette[i], '--i': i});
        $('#scaleChar').before(titleChar) ;
        await sleep(50);
    }
    $('#title').css('text-align-last', 'justify');
}

async function animateMagicTextIn(speed, duration) {
    let magicElements = _.shuffle($('.char'))
    let steps = Math.ceil(duration / speed);
    let perStep = Math.floor(magicElements.length / steps);
    for (let i = 0; i<magicElements.length; i++) {
        $(magicElements[i]).show();
        if (i % perStep === 0) await sleep(speed);
    }
}

function resize() {
    $('.char').remove();
    $('.magic-link').remove();
    buildGrid();
    $('.char').show();
}

// Float away effect
const floatAwayOptions = {
    translate: {min: -50, max: 50},
    rotate: {min: -5, max: 5},
    rotateAngle: {min: -45, max: 45}
}

$.fn.setFloatAwayVars = function(tx = 0, ty = 0, tz = 0, rx = 0, ry = 0, rz = 0, ra = 0) {
    $(this).css({'--tx': `${tx}px`, '--ty': `${ty}px`, '--tz': `${tz}px`, '--rx': `${rx}`, '--ry': `${ry}`, '--rz': `${rz}`, '--ra': `${ra}deg`})
}

function floatAway() {
    let elems = $('.float-away').children('span');
    Array.from(elems).forEach(element => {
        $(element).setFloatAwayVars(...getFloatAwayVars());
    });
};

function getFloatAwayVars() {
    return [
        rand(floatAwayOptions.translate.max, floatAwayOptions.translate.min),
        rand(floatAwayOptions.translate.max, floatAwayOptions.translate.min),
        rand(floatAwayOptions.translate.max, floatAwayOptions.translate.min),
        rand(floatAwayOptions.rotate.max, floatAwayOptions.rotate.min),
        rand(floatAwayOptions.rotate.max, floatAwayOptions.rotate.min),
        rand(floatAwayOptions.rotate.max, floatAwayOptions.rotate.min),
        rand(floatAwayOptions.rotateAngle.max, floatAwayOptions.rotateAngle.min)
    ];
}

async function main() {
    buildGrid();
    await animateIn();
    floatAway();
}

$(window).on('resize', _.debounce(resize, 50))
$(document).ready(main)