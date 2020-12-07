exports.geraPostConfirm = geraPostConfirm
exports.fileList = fileList
exports.fileForm = fileForm

// File List HTML Page Template  -----------------------------------------
function fileList(files, d) {
    let pagHTML = `
      <html>
          <head>
              <title>File List</title>
              <meta charset="utf-8"/>
              <link rel="icon" href="/favicon.png"/>
              <link rel="stylesheet" href="/w3.css"/>
              <script src="/jquery-3.5.1.min.js"></script>
              <script src="/imagens.js"></script>
              <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.js"></script>
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.css" />
          </head>
          <body>
              <div class="w3-card-4 modal" id="display"></div>

              <div class="w3-container w3-teal">
                  <h2>File List</h2>
              </div>
              <table class="w3-table w3-bordered">
                  <tr>
                      <th>Date</th>
                      <th>File</th>
                      <th>Size</th>
                      <th>Type</th>
                  </tr>
    `
    files.forEach(f => {
        pagHTML += `
          <tr onclick='showImage(\"${f.name}", \"${f.mimetype}\");'>
              <td>${f.date}</td>
              <td>${f.name}</td>
              <td>${f.size}</td>
              <td>${f.mimetype}</td>
          </tr>
      `
    })

    pagHTML += `
          </table>
          <div class="w3-container w3-teal">
              <address>Generated by upload-single::PRI2020 em ${d} --------------</address>
          </div>
      </body>
      </html>
    `
    return pagHTML
}

// File Form HTML Page Template ------------------------------------------
function fileForm(d) {
    return `
    <html>
        <head>
            <title>File Upload</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="/favicon.png"/>
            <link rel="stylesheet" href="/w3.css"/>
            <script src="/uploads.js"></script>
            <script src="/jquery-3.5.1.min.js"></script>
        </head>
        <body>
        
        </body>
            <div class="w3-container w3-teal">
                <h2>File Upload</h2>
            </div>

            <form class="w3-container" action="/files" method="POST" enctype="multipart/form-data">7
                <files>
                    <label class="w3-text-teal"><b>Select file</b></label>
                    <input class="w3-input w3-border w3-light-grey" type="file" name="myFile">
                </files>
                <input class="w3-btn w3-blue-grey" type="submit" value="Submit"/>
            </form>
            <div class="w3-btn w3-blue-grey" onclick="addUpload();">
                Add new file
            </div>

            <footer class="w3-container w3-teal">
                <address>Gerado por galuno::PRI2020 em ${d}</address>
            </footer>
        </body>
    </html>
    `
}

// POST Confirmation HTML Page Template -------------------------------------
function geraPostConfirm(aluno, d) {
    return `
    <html>
    <head>
        <title>POST receipt: ${aluno.id}</title>
        <meta charset="utf-8"/>
        <link rel="icon" href="favicon.png"/>
        <link rel="stylesheet" href="w3.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-teal">
                <h1>Aluno ${aluno.id} inserido</h1>
            </header>

            <div class="w3-container">
                <p><a href="/alunos/${aluno.id}">Aceda aqui Ã  sua pÃ¡gina."</a></p>
            </div>

            <footer class="w3-container w3-teal">
                <address>Gerado por galuno::PRI2020 em ${d} - [<a href="/">Voltar</a>]</address>
            </footer>
        </div>
    </body>
    </html>
    `
}