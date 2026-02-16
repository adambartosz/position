const DEFAULT_STEP = 5;
const DEFAULT_PLUS = 235;
const DEFAULT_MINUS = 0;
const DEFAULT_RESET = 100;
var boolofust = "Pokaż";

function zapiszUstawienia() {
    localStorage.setItem("si", si);
    localStorage.setItem("step", getStep());
    localStorage.setItem("plus", getlimitplus());
    localStorage.setItem("minus", getlimitminus());
    localStorage.setItem("reset", getResetValue());
}
function wczytajUstawienia() {
    document.getElementById("powiekszanie").value =
        localStorage.getItem("step") || DEFAULT_STEP;

    document.getElementById("pluslimit").value =
        localStorage.getItem("plus") || DEFAULT_PLUS;

    document.getElementById("miuslimit").value =
        localStorage.getItem("minus") || DEFAULT_MINUS;

    document.getElementById("resetlimit").value =
        localStorage.getItem("reset") || DEFAULT_RESET;
    si = Number(localStorage.getItem("si")) || DEFAULT_RESET;
    var max = getlimitplus();
    var min = getlimitminus();
    if (si > max) si = max;
    if (si < min) si = min;
    document.querySelectorAll(".text")
        .forEach(el => el.style.fontSize = si + "%");

    updateSizeDisplay();
    updateButtons();
}

let si = DEFAULT_RESET;

document.addEventListener("DOMContentLoaded", () => {
    wczytajUstawienia();
    naprawLimity();
    updateButtonTitles();
    updateButtons();

    var trybekranu = document.getElementById("trybekranu");
    var zapisanyTryb = localStorage.getItem("mode");
    if (zapisanyTryb) {
        document.body.classList.add("mode-" + zapisanyTryb);
        document.getElementById("trybekranu").value = zapisanyTryb;
    }
    if (trybekranu) {
        trybekranu.addEventListener("change", () => {
            var mode = trybekranu.value;

            document.body.classList.remove("mode-normal", "mode-dark", "mode-contrast");
            document.body.classList.add("mode-" + mode);

            localStorage.setItem("mode", mode);
        });
    }
    updateButtons();
    var liItems = document.querySelectorAll("nav li");
    liItems.forEach(li => {
        var submenu = li.querySelector("ul");
        if (!submenu) return;

        var arrowDiv = document.createElement("div");
        arrowDiv.className = "rozwiniecieli";
        arrowDiv.style.padding = 0;

        var arrowSpan = document.createElement("span");
        arrowSpan.textContent = "⬇️";
        arrowSpan.style.display = "inline-block";
        arrowSpan.style.transition = "transform 0.3s ease";

        arrowDiv.appendChild(arrowSpan);
        li.style.padding = 0;
        li.insertBefore(arrowDiv, submenu);

        var level = 1;
        var parentLi = li.parentElement.closest("li");
        while (parentLi) {
            level++;
            parentLi = parentLi.parentElement.closest("li");
        }
        submenu.style.backgroundColor = colors[(level - 1) % colors.length];
        arrowDiv.addEventListener("click", e => {
            e.stopPropagation();
            li.classList.toggle("open");
            if (arrowSpan.style.transform === "rotate(180deg)") {
                arrowSpan.style.transform = "rotate(0deg)";
            } else {
                arrowSpan.style.transform = "rotate(180deg)";
            }
        });



    });
    var inpaut = document.getElementById("powiekszanie");
    var limitpowiekszania = document.getElementById("pluslimit");
    var limitpomniejszania = document.getElementById("miuslimit");
    if (limitpowiekszania) {
        limitpowiekszania.addEventListener("focus", () => { limitpowiekszania.select(); });
    }
    if (limitpomniejszania) {
        limitpomniejszania.addEventListener("focus", () => { limitpomniejszania.select(); });
    }
    if (inpaut) {
        inpaut.addEventListener("focus", () => {
            inpaut.select();
        });
    }
    if (limitpowiekszania) {
        limitpowiekszania.addEventListener("change", naprawLimity);
    }
    if (limitpomniejszania) {
        limitpomniejszania.addEventListener("change", naprawLimity);
    }
    if (inpaut) {
        inpaut.addEventListener("change", naprawLimity);
    }

    var limitresetu = document.getElementById("resetlimit");
    if (limitresetu) {
        limitresetu.addEventListener("focus", () => {
            limitresetu.select();
        });
    }
    if (limitresetu) {
        limitresetu.addEventListener("change", () => {
            var max = getlimitplus();
            var min = getlimitminus();
            var val = parseInt(limitresetu.value, 10);

            if (isNaN(val)) val = DEFAULT_RESET;
            if (val > max) val = max;
            if (val < min) val = min;

            limitresetu.value = val;
        });
    }

    var bgghb = document.getElementById("resetlimit");
    if (bgghb) {
        bgghb.addEventListener("change", () => {
            var resetInput = document.getElementById("resetlimit");
            var val = parseInt(resetInput.value, 10);
            var max = getlimitplus();
            var min = getlimitminus();

            if (isNaN(val)) val = DEFAULT_RESET;

            if (val < min) {
                alert(`Nie można ustawić wartości resetu poniżej limitu MINUS (${min})! Zmieniono na ${min}.`);
                val = min;
            } else if (val > max) {
                alert(`Nie można ustawić wartości resetu powyżej limitu PLUS (${max})! Zmieniono na ${max}.`);
                val = max;
            }

            resetInput.value = val;
            naprawLimity();
        });
    }
    var fghjkl = document.getElementById("pluslimit");
    if (fghjkl) {
        fghjkl.addEventListener("change", () => {
            var val = parseInt(document.getElementById("pluslimit").value, 10);
            if (val < 0) {
                alert("Nie można ustawiać ujemnego limit! Zmieniono na wartość bezwzględną.");
                val = Math.abs(val);
                document.getElementById("pluslimit").value = val;
            }
            naprawLimity();
        });
    }

    var linuminit = document.getElementById("miuslimit");
    if (linuminit) {
        linuminit.addEventListener("change", () => {
            var val = parseInt(document.getElementById("miuslimit").value, 10);
            if (val < 0) {
                alert("Nie można ustawiać ujemnego limitu! Zmieniono na wartość bezwzględną.");
                val = Math.abs(val);
                document.getElementById("miuslimit").value = val;
            }
            naprawLimity();
        });
    }
    document.querySelectorAll("nav li > a").forEach(a => {
        if (a.dataset.split === 'true') return;

        var textNodes = Array.from(a.childNodes)
            .filter(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim() !== "");

        textNodes.forEach(node => {
            var words = node.textContent.trim().split(/\s+/);
            var frag = document.createDocumentFragment();

            words.forEach(word => {
                let span = document.createElement("span");
                span.className = "asdfgh";

                let breakLine = false;

                if (word[word.length - 1] === "n" && word[word.length - 2] === "\\") {
                    breakLine = true;
                    word = word.slice(0, -2);
                }

                span.textContent = word + " ";
                frag.appendChild(span);

                if (breakLine) {
                    frag.appendChild(document.createElement("br"));
                }
            });
            node.replaceWith(frag);
        });

        a.dataset.split = 'true';
    });
    const jednorazowypokaźnik = document.getElementById("lewygornyrog");
    const kreska = document.getElementById("kreska");
    if (jednorazowypokaźnik && kreska) jednorazowypokaźnik.addEventListener("mouseenter", () => {
        document.getElementById("kropka").style.zIndex = '1';
        kreska.style.zIndex = '1'; kreska.style.animation = 'linia 5s linear infinite';
    })
    if (jednorazowypokaźnik && kreska) jednorazowypokaźnik.addEventListener("mouseleave", () => {
        document.getElementById("kropka").style.zIndex = '-1';
        kreska.style.zIndex = '-1';
        kreska.style.top = '60px';
        kreska.style.left = '500px';
        kreska.style.animation = "none";
    })
    const lewya = document.getElementById("lewygornyroga");
    const kreska2 = document.getElementById("kreska2");
    if (lewya && kreska2) lewya.addEventListener("mouseenter", () => {
        document.getElementById("kropka2").style.zIndex = "1";
        kreska2.style.zIndex = "1";
        kreska2.style.animation = 'linia2 5s linear infinite';
    })
    if (lewya && kreska2) lewya.addEventListener("mouseleave", () => {
        document.getElementById("kropka2").style.zIndex = "-1";
        kreska2.style.zIndex = "-1";
        kreska2.style.animation = "none";
        kreska2.style.bottom = "0";
        kreska2.style.right = "0";
    })
    const zin1 = document.getElementById("z1");
    const zin2 = document.getElementById("z2");
    const zin3 = document.getElementById("z3");
    if (zin1) zin1.addEventListener("change", () => {
        updatezindexes();
    });
    if (zin2) zin2.addEventListener("change", () => {
        updatezindexes();
    });
    if (zin3) zin3.addEventListener("change", () => {
        updatezindexes();
    });
    function updatezindexes() {
        document.getElementById('box1').style.zIndex = document.getElementById('z1').value;
        document.getElementById('box2').style.zIndex = document.getElementById('z2').value;
        document.getElementById('box3').style.zIndex = document.getElementById('z3').value;
    }

});



function naprawLimity() {
    let step = getStep();
    let plus = getlimitplus();
    let minus = getlimitminus();

    if (plus < 0) plus = 0;
    if (minus < 0) minus = 0;
    if (minus >= plus) minus = Math.max(0, plus - step);

    if (si > plus) si = plus;
    if (si < minus) si = minus;
    let reset = getResetValue();
    if (reset > plus) reset = plus;
    if (reset < minus) reset = minus;
    document.getElementById("resetlimit").value = reset;

    document.getElementById("pluslimit").value = plus;
    document.getElementById("miuslimit").value = minus;

    document.querySelectorAll(".text").forEach(el => el.style.fontSize = si + "%");
    updateSizeDisplay();
    updateButtons();
    zapiszUstawienia();
}





function resetujvalstep() {
    var stepInput = document.getElementById("powiekszanie");
    stepInput.value = DEFAULT_STEP;
    naprawLimity();
}
function resetujvalpow() {
    var plusInput = document.getElementById("pluslimit");
    plusInput.value = DEFAULT_PLUS;
    naprawLimity();
}
function resetujvalpom() {
    var minusInput = document.getElementById("miuslimit");
    minusInput.value = DEFAULT_MINUS;
    naprawLimity();
}
function resetujvalres() {
    var stepInput = document.getElementById("powiekszanie");
    var plusInput = document.getElementById("pluslimit");
    var minusInput = document.getElementById("miuslimit");
    var resetInput = document.getElementById("resetlimit");

    stepInput.value = DEFAULT_STEP;
    plusInput.value = DEFAULT_PLUS;
    minusInput.value = DEFAULT_MINUS;
    resetInput.value = DEFAULT_RESET;

    si = DEFAULT_RESET;

    naprawLimity();
}
function resetujWszystkieLimity() {
    document.getElementById("powiekszanie").value = DEFAULT_STEP;
    document.getElementById("pluslimit").value = DEFAULT_PLUS;
    document.getElementById("miuslimit").value = DEFAULT_MINUS;
    document.getElementById("resetlimit").value = DEFAULT_RESET;
    si = DEFAULT_RESET;
    naprawLimity();
    updateButtons();
    alert("Wszystkie limity zostały przywrócone do wartości domyślnych!");
}



function getStep() {
    var input = document.getElementById("powiekszanie");
    if (!input) return DEFAULT_STEP;
    var val = input.value;
    val = val.match(/\d+/)?.[0] || "5";
    val = Number(val);
    return val;

}
function getlimitplus() {
    var val = document.getElementById("pluslimit").value;
    if (!val) return DEFAULT_PLUS;
    val = val.match(/\d+/)?.[0] || "235";
    val = Number(val);
    return val;

}
function getlimitminus() {
    var val = document.getElementById("miuslimit").value;
    if (!val) return DEFAULT_MINUS;
    val = val.match(/\d+/)?.[0] || "0";
    val = Number(val);
    return val;

}
function getResetValue() {
    var val = parseInt(document.getElementById("resetlimit").value, 10);
    if (!val) return DEFAULT_RESET;
    var max = getlimitplus();
    var min = getlimitminus();

    if (isNaN(val)) val = DEFAULT_RESET;
    if (val < min) val = min;
    if (val > max) val = max;
    document.getElementById("resetlimit").value = val;

    return val;
}


function updateSizeDisplay() {
    var sizeDiv = document.getElementById("size");
    if (sizeDiv) {
        sizeDiv.innerHTML = `Rozmiar<br>czcionki<br>${si}%`;
    }
} function updateButtonTitles() {
    var plusBtn = document.getElementById("plus");
    var minusBtn = document.getElementById("minus");
    var resetBtn = document.getElementById("q");
    var settbutton = document.getElementById("settingsbutton");

    var step = getStep();
    var resetValue = getResetValue();
    var max = getlimitplus();
    var min = getlimitminus();
    if (plusBtn) plusBtn.title = si >= max ? `Nie można zwiększyć – osiągnięto limit ${max}%` : `Zwiększ o: ${step}%`;
    if (minusBtn) minusBtn.title = si <= min ? `Nie można zmniejszyć – osiągnięto limit ${min}%` : `Zmniejsz o: ${step}%`;
    if (resetBtn) resetBtn.title = `Resetuj do: ${resetValue}%`;
    if (settbutton) settbutton.title = `${boolofust} ustawienia`;
}


function updateButtons() {
    var plusBtn = document.getElementById("plus");
    var minusBtn = document.getElementById("minus");
    var max = getlimitplus();
    var min = getlimitminus();

    if (si >= max) {
        plusBtn.textContent = "🔒";
    } else {
        plusBtn.textContent = "+";
    }
    if (si <= min) {
        minusBtn.textContent = "🔒";
    } else {
        minusBtn.textContent = "−";
    }

    updateButtonTitles();
}

function powieksz() {
    let step = getStep();
    let max = getlimitplus();
    let nextSi = si + step;
    if (nextSi > max) nextSi = max;

    si = nextSi;

    document.querySelectorAll(".text").forEach(el => el.style.fontSize = si + "%");
    updateSizeDisplay();
    updateButtons();
}

function pomniejsz() {
    let step = getStep();
    let min = getlimitminus();

    let nextSi = si - step;
    if (nextSi < min) nextSi = min;

    si = nextSi;

    document.querySelectorAll(".text").forEach(el => el.style.fontSize = si + "%");
    updateSizeDisplay();
    updateButtons();
}

function resetuj() {
    si = getResetValue();
    let max = getlimitplus();
    let min = getlimitminus();
    if (si > max) si = max;
    if (si < min) si = min;

    document.querySelectorAll(".text").forEach(el => el.style.fontSize = si + "%");
    updateSizeDisplay();
    updateButtons();
}



var colortlap = false;
function zmienkolorp() {
    if (colortlap === false) {
        var a = document.querySelectorAll(".Paragraph");
        a.forEach(element => {
            element.style.backgroundColor = "blue";
            element.style.color = "white";
        });
        document.getElementById("przyciskkoloru").textContent = "COFNIJ";
        colortlap = true;
    } else {
        var a = document.querySelectorAll(".Paragraph");
        a.forEach(element => {
            element.style.backgroundColor = "whitesmoke";
            element.style.color = "black";
        });
        document.getElementById("przyciskkoloru").textContent = "PRZETESTUJ";
        colortlap = false;
    }
}
function testklasa() {
    var kolor = document.getElementById("kolorkl").textContent;
    var a = document.querySelectorAll(".tytulklasa");
    a.forEach(i => {
        i.style.color = kolor;
    });

}
function resetujkoloryklas() {
    document.getElementById("kolorkl").textContent = "red";
    var a = document.querySelectorAll(".tytulklasa");
    a.forEach(i => {
        i.style.color = "black";
    });
}
function testklasa2() {
    var kolor = document.getElementById("kolorkl2").textContent;
    var a = document.querySelectorAll(".tytulklasa2");
    a.forEach(i => {
        i.style.color = kolor;
    });
}
function resetujkoloryklas2() {
    document.getElementById("kolorkl2").textContent = "red";
    var a = document.querySelectorAll(".tytulklasa2");
    a.forEach(i => {
        i.style.color = "black";
    });
}

var czyodpowiedziano = false;


function policzpunkty(len, wynikid, pytanieid, odpowiedzid, listakomentarzy) {
    if (czyodpowiedziano == true) { return; }
    var total = len;
    var wyn = wynikid;
    var pyt = pytanieid;
    var odp = odpowiedzid;
    var punkty = 0;
    var zle = [];
    var pytania = [];
    var wynikDiv = document.getElementById(wyn);


    for (var i = 1; i <= total; i++) {
        pytania.push(i);
    }


    for (var i = 1; i <= total; i++) {
        var radios = document.getElementsByName(odp + i);
        for (var radio of radios) {
            if (radio.checked) {
                pytania = pytania.filter(p => p !== i);
            }
        }
    }


    if (pytania.length > 0) {
        wynikDiv.innerHTML = `Odpowiedz najpierw na wszystkie pytania! <br>Zostały ci jeszcze: <br>`;
        for (var i = 0; i < pytania.length; i++) {
            var qNum = pytania[i];
            wynikDiv.innerHTML += `<a href="#${pyt}${qNum}">${qNum}</a>`;
            if (i < pytania.length - 1) wynikDiv.innerHTML += `, `;
        }
        wynikDiv.innerHTML += `<br><small>[Możesz się przenosić hiperłączem, klikając na w.w. numery pytań]</small>`;
        return;
    }
    for (var i = 1; i <= total; i++) {
        var radios = document.getElementsByName(odp + i);
        for (var radio of radios) {
            if (radio.checked) {
                if (radio.value === "1") {
                    punkty++;
                    document.getElementById(pyt + i).style.backgroundColor = "var(--box2)";
                } else {
                    zle.push(i);
                    document.getElementById(pyt + i).style.backgroundColor = "var(--box1)";
                }
            }
        }
    }
    var wtnik = punkty / total;
    var procent = (wtnik * 100).toFixed(1);
    wynikDiv.innerHTML = `Twój wynik: ${punkty} / ${total} (${procent}%)`;


    if (zle.length > 0) {
        wynikDiv.innerHTML += `<br>Pytania, na które udzielono niepoprawnej odpowiedzi to: <br>`;
        for (var i = 0; i < zle.length; i++) {
            var qNum = zle[i];
            wynikDiv.innerHTML += `<a href="#${pyt}${qNum}"">${qNum}</a>`;
            if (i < zle.length - 1) wynikDiv.innerHTML += `, `;
            document.getElementById(pyt + qNum).innerHTML += `<br>Komentarz:<br><span style="font-weight: bold;">${listakomentarzy[qNum - 1]}</span>`;
        }
    } else {
        wynikDiv.innerHTML += `<br>Gratuluję perfekcyjnego wyniku!`;
    }
    var ocena;
    if (Math.abs(wtnik - 1) < 0.001) {
        ocena = "celujący (6)";
    } else if (wtnik >= 0.9) {
        ocena = "bardzo dobry (5)";
    } else if (wtnik >= 0.85) {
        ocena = "+ dobry (4+)";
    } else if (wtnik >= 0.7) {
        ocena = "dobry (4)";
    } else if (wtnik >= 0.65) {
        ocena = "+ dostateczny (3+)";
    } else if (wtnik >= 0.5) {
        ocena = "dostateczny (3)";
    } else if (wtnik >= 0.4) {
        ocena = "dopuszczający (2)";
    } else {
        ocena = "niedostateczny (1)";
    }

    wynikDiv.innerHTML += `<br><br>Twoja ocena to: ${ocena}<br>`;
    if (ocena !== "celujący (6)") {
        wynikDiv.innerHTML += `<br><small>[Możesz się przenosić hiperłączem, klikając na w.w. numery pytań]</small>`;
    }
    czyodpowiedziano = true;
};


var colors = [
    "rgba(255, 0, 0, 0.7)",
    "rgba(255, 127, 0, 0.7)",
    "rgba(255, 255, 0, 0.7)",
    "rgba(0, 255, 0, 0.7)",
    "rgba(0, 255, 255, 0.7)",
    "rgba(0, 0, 255, 0.7)",
    "rgba(75, 0, 130, 0.7)",
    "rgba(128, 0, 128, 0.7)",
    "rgba(148, 0, 211, 0.7)",
    "rgba(255, 20, 147, 0.7)"

];



var pokazustawieniaz = false;
function pokazustawienia() {
    if (pokazustawieniaz === false) {
        boolofust = "Schowaj";
        animacja(document.querySelector("#pasekustawien"), 0, 1, 1);
        pokazustawieniaz = true;
    }
    else {
        boolofust = "Pokaż";
        animacja(document.querySelector("#pasekustawien"), 130, 0, 0);
        pokazustawieniaz = false;
    }
    updateButtons();

}
function animacja(el, w, o, state) {
    el.style.top = w + "vh";
    if (state === 1) {
        document.getElementById("settingsbutton").style.backgroundImage = "linear-gradient(to bottom right, rgb(136, 22, 14), rgb(255, 5, 5))";
        document.getElementById("settingsbutton").textContent = "x";
    }
    else {
        document.getElementById("settingsbutton").style.backgroundImage = "linear-gradient(to bottom, var(--btn-bg), var(--btn-bg))";
        document.getElementById("settingsbutton").textContent = "⚙️";
    }

    el.style.opacity = o;
}





function resetDoFabrycznych() {
    localStorage.clear();
    location.reload();
}


function pokazodsy(pozycja) {
    var t = ['Jeśli zostaną wprowadzone nieprawidłowe liczby, zostaną one automatycznie zmienione, żeby uniknąć błędów.',];
    alert(t[pozycja - 1]);
}
function resetujparpos(type) {
    document.getElementById("top" + type).textContent = 'auto';
    document.getElementById("bot" + type).textContent = 'auto';
    document.getElementById("lef" + type).textContent = 'auto';
    document.getElementById("rig" + type).textContent = 'auto';
    przetestujparpos(type);
}
function przetestujparpos(typ) {
    const rel = document.getElementById("paragraf" + typ);
    rel.style.top = parseCssValue(document.getElementById("top" + typ).textContent);
    rel.style.bottom = parseCssValue(document.getElementById("bot" + typ).textContent);
    rel.style.left = parseCssValue(document.getElementById("lef" + typ).textContent);
    rel.style.right = parseCssValue(document.getElementById("rig" + typ).textContent);
}


function parseCssValue(val) {
    val = val.trim().toLowerCase();
    if (val === "auto") return "auto";
    if (/^\d+$/.test(val)) return val + "px";
    if (/^\d+(px|%|em|rem|vh|vw)$/.test(val)) return val;
    return "auto";
}
let czyabs = false;
function togglepositionabs() {
    const parabs = document.getElementById("paragrafabs");
    if (!czyabs) { parabs.style.position = "absolute"; czyabs = true; }
    else { parabs.style.position = "static"; czyabs = false }

} let czyfix = false;
function togglepositionfix() {
    const parfix = document.getElementById("paragraffix");
    if (!czyfix) { parfix.style.position = "fixed"; czyfix = true; }
    else { parfix.style.position = "static"; czyfix = false }
}
let czystick = false;
function togglepositionstick() {
    const parsti = document.getElementById("paragrafstick");
    if (!czystick) {
        parsti.style.position = "sticky";
        czystick = true;
    } else {
        parsti.style.position = "static";
        czystick = false;
    }
}
