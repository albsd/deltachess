
const addr = "http://localhost:3000";

function addLinkToFlame() {
    let elem = document.getElementById("flamesplash");

    elem.addEventListener('click', function (e) {
        window.location.href = addr + "/play";
    });
}

function headerInit(audio1Path, audio2Path) {
    let deltalogo = document.getElementById("deltalogo");
    console.log("header init");

    const audio1 = new Audio(audio1Path);
    const audio2 = new Audio(audio2Path);
    deltalogo.addEventListener('click', function (e) {
        audio1.play();
    });

    let tulogo  = document.getElementById("tudlogo");

    tulogo.addEventListener('click', function (e) {
        audio2.play();
    });


}
/** *
 * 
 * 
 * 
 */
(function splash () {


    const audio1Path = "./music/mtr.mp3";
    const audio2Path = "./music/stop_breathing.mp3";

    addLinkToFlame();
    headerInit(audio1Path, audio2Path);
})();