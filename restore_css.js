const fs = require('fs');
let css = fs.readFileSync('public/css/style.css', 'utf8');
const modalCss = `/* ================= POPUP (MODAL) STYLE ================= */
.modal {
    display: none;
    position: fixed;
    z-index: 9999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    align-items: center;
    justify-content: center;
}

.modal-content {
    background-color: #fff;
    padding: 10px;
    border-radius: 12px;
    width: 100%;
    max-width: 100%;
    position: relative;
    animation: zoomIn 0.3s ease;
}

@keyframes zoomIn {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}

.close-modal {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 28px;
    font-weight: bold;
    color: #333;
    cursor: pointer;
}

.modal-content img {
    width: 100%;
    max-height: 250px;
    object-fit: contain;
    border-radius: 8px;
    margin-bottom: 15px;
}

.modal-content h4 {
    font-size: 22px;
    color: #000;
    margin-bottom: 10px;
}

.modal-content p {
    font-size: 16px;
    color: #4a6f8a;
    line-height: 1.5;
}
`;
css = css.replace('/* Custom Modal CSS Removed */', modalCss);
fs.writeFileSync('public/css/style.css', css);
