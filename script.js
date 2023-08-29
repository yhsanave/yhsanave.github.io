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

const funcChars = [
    {char: 'X', func: () => clearFuncEffects()},
    {char: '@', func: () => applyWrapperBackground('@', 'linear-gradient(80deg, #40e0d0, #ff8c00, #ff0080, #ff8c00, #40e0d0, #ff8c00, #ff0080)')},
    {char: '$', func: () => applyWrapperBackground('$', 'linear-gradient(80deg, #00ff00, #00ffff, #0000ff, #00ffff, #00ff00, #00ffff, #0000ff)')},
    {char: '^', func: () => applyWrapperBackground('^', 'linear-gradient(80deg, rgba(226,140,0,1) 0%, rgba(236,205,0,1) 8%, rgba(255,255,255,1) 16%, rgba(98,174,220,1) 24%, rgba(32,56,86,1) 32%, rgba(98,174,220,1) 41%, rgba(255,255,255,1) 50%, rgba(236,205,0,1) 59%, rgba(226,140,0,1) 68%, rgba(236,205,0,1) 76%, rgba(255,255,255,1) 84%, rgba(98,174,220,1) 92%, rgba(32,56,86,1) 100%)')},
    {char: '&', func: () => toggleCharColors('&', ['#e28c00', '#eccd00', '#ffffff', '#62aedc', '#203856'])},
    {char: '%', func: () => toggleCharColors('%', ['#6B26D9', '#246EB9', '#4CB944', '#FFB30F', '#DB222A'])},
    {char: '*', func: () => shatter()},
];
const funcState = {
    background: '',
    text: '',
    textColors: [],
    shatter: false,
}

const minRows = links.length+2;
const minColumns = Math.max(...links.map(l => linkLength(l)))+1;
const magicGrid = {rows: minRows, columns: minColumns};
$(':root').css('--ideal-rows', Math.floor(minRows*1.5)) // Try to scale the font so that there are ~50% more rows than links

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
                .prop({'data-row': row, 'data-col': col})
                .hide()
            );
        });
    });
    return $elem;
}

function buildGrid() {
    let wrapper = $('#magicWrapper');
    magicGrid.rows = Math.max(Math.floor(wrapper.height() / $('#scaleChar').height())-1, minRows);
    magicGrid.columns = Math.max(Math.floor(wrapper.width() / $('#scaleChar').width())-1, minColumns);
    wrapper.css({'--rows': magicGrid.rows, '--columns': magicGrid.columns});

    let linkSpacing = (magicGrid.rows) / links.length;
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
                $(`<span class='char magic-char' data-row="${row}" data-col="${col}">${randChar()}</span>`)
                .css({'--row': row, '--col': col})
                .hide()
            );
        }
    }

    let funcPositions = _.sampleSize($('.magic-char'), funcChars.length);
    funcChars.forEach((c, i) => {
        $(funcPositions[i])
        .removeClass('magic-char')
        .addClass('func-char')
        .text(c.char)
        .on('click', c.func)
    });
}

function mutate(strength) {
    let chars = _.sampleSize($('.magic-char'), strength);
    chars.forEach((c) => {
        $(c).text(randChar());
        if (funcState.text) $(c).css('color', _.sample(funcState.textColors));
    });
}

async function animateIn() {
    await sleep(1000);
    await animateTitleIn();
    await sleep(500);
    $('.cursor').hide();
    await animateMagicTextIn(5, 1000);
}

async function animateTitleIn() {
    for (let i = 0; i < title.length; i++) {
        let titleChar = $(`<span id="title_${i}">${title[i]}</span>`).css({'color': titlePalette[i], '--i': i});
        $('.cursor').before(titleChar) ;
        await sleep(50);
    }
    // $('#title').css('text-align-last', 'justify');
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

// Shatter effect
const shatterOptions = {
    translate: {min: -20, max: 20},
    rotate: {min: -1, max: 1},
    rotateAngle: {min: -45, max: 45}
}

$.fn.setShatterVars = function(tx = 0, ty = 0, tz = 0, rx = 0, ry = 0, rz = 0, ra = 0) {
    $(this).css({'--tx': `${tx}px`, '--ty': `${ty}px`, '--tz': `${tz}px`, '--rx': `${rx}`, '--ry': `${ry}`, '--rz': `${rz}`, '--ra': `${ra}deg`})
}

function applyShatter() {
    let elems = $('.shatter');
    Array.from(elems).forEach(element => {
        $(element).setShatterVars(...getShatterVars());
    });
};

function getShatterVars() {
    return [
        rand(shatterOptions.translate.max, shatterOptions.translate.min),
        rand(shatterOptions.translate.max, shatterOptions.translate.min),
        rand(shatterOptions.translate.max, shatterOptions.translate.min),
        rand(shatterOptions.rotate.max, shatterOptions.rotate.min),
        rand(shatterOptions.rotate.max, shatterOptions.rotate.min),
        rand(shatterOptions.rotate.max, shatterOptions.rotate.min),
        rand(shatterOptions.rotateAngle.max, shatterOptions.rotateAngle.min)
    ];
}

// Func Char functions
function clearFuncEffects(effects = ['background', 'text', 'shatter']) {
    // applyWrapperBackground
    if (effects.includes('background')) {
        let wrapper = $('.magic-wrapper');
        wrapper.toggleClass('bg-text bg-gradient-flow', false);
        wrapper.css('background', 'none');
        funcState.background = '';
    }

    // toggleCharColors
    if (effects.includes('text')) {
        $('.magic-char').css('color', '')
        funcState.text = '';
        funcState.textColors = [];
    }

    // shatter
    if (effects.includes('shatter')) {
        $('.shatter').removeClass('shatter');
        funcState.shatter = false;
    }
}

function applyWrapperBackground(char, background) {
    if (funcState.text) clearFuncEffects(['text']);

    let wrapper = $('.magic-wrapper');
    let toggleState = funcState.background === char;
    wrapper.toggleClass('bg-text bg-gradient-flow', !toggleState);
    wrapper.css('background', toggleState ? 'none' : background);
    funcState.background = toggleState ? '' : char;
}

function toggleCharColors(char, colors) {
    if (funcState.background) clearFuncEffects(['background']);

    let chars = $('.magic-char');
    if (funcState.text === char) {
        $(chars).css('color', '')
        funcState.text = '';
        funcState.textColors = [];
        return;
    }
    
    Array.from(chars).forEach(c => {
        $(c).css('color', _.sample(colors))
    })

    funcState.text = char;
    funcState.textColors = colors;
}

async function shatter() {
    $('.magic-wrapper').toggleClass('shake', !funcState.shatter);
    setTimeout(() => {$('.magic-wrapper').removeClass('shake')}, 800);
    
    $('.char').toggleClass('shatter', !funcState.shatter);
    funcState.shatter = !funcState.shatter;
    applyShatter();
}

async function main() {
    buildGrid();
    await animateIn();
}

$(window).on('resize', _.debounce(resize, 50))
$(document).ready(main)