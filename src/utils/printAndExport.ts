// Helper utilities for clean printing and exporting to Microsoft Word (.doc)

export function printElement(elementId: string, title: string = 'Văn bản Thẩm định ATTP') {
  const elem = document.getElementById(elementId);
  if (!elem) {
    window.print();
    return;
  }

  // Create an offscreen iframe for clean isolated printing
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <meta charset="utf-8" />
        <style>
          @page {
            size: A4;
            margin: 20mm 15mm 20mm 15mm;
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 13pt;
            line-height: 1.5;
            color: #000;
            background: #fff;
            margin: 0;
            padding: 0;
          }
          h3 {
            font-size: 14pt;
            font-weight: bold;
            text-align: center;
            text-transform: uppercase;
            margin-top: 12px;
            margin-bottom: 8px;
          }
          h4 {
            font-size: 12pt;
            font-weight: bold;
            margin-top: 10px;
            margin-bottom: 6px;
          }
          p {
            margin-top: 4px;
            margin-bottom: 6px;
            text-align: justify;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            margin-bottom: 12px;
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          th, td {
            border: 1px solid #333;
            padding: 6px 8px;
            font-size: 10.5pt;
            font-family: Arial, sans-serif;
            text-align: left;
            vertical-align: top;
          }
          th {
            background-color: #f1f5f9 !important;
            font-weight: bold;
            text-align: center;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .font-bold { font-weight: bold; }
          .uppercase { text-transform: uppercase; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .italic { font-style: italic; }
          .flex { display: flex; justify-content: space-between; align-items: flex-start; }
          .justify-between { display: flex; justify-content: space-between; }
          .items-start { align-items: flex-start; }
          .my-6 { margin-top: 1.5rem; margin-bottom: 1.5rem; }
          .mb-4 { margin-bottom: 1rem; }
          .mt-4 { margin-top: 1rem; }
          .pt-8 { padding-top: 2rem; }
          .w-12 { width: 3rem; }
          .w-16 { width: 4rem; }
          .w-24 { width: 6rem; }
          .w-28 { width: 7rem; }
          .bg-emerald-50, .bg-slate-50 { background-color: #f8fafc !important; }
        </style>
      </head>
      <body>
        ${elem.innerHTML}
      </body>
    </html>
  `);
  doc.close();

  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.error('Print iframe failed, fallback to window.print():', e);
      window.print();
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2000);
    }
  }, 300);
}

export function exportToWord(elementId: string, filename: string = 'Van_ban_tham_dinh.doc') {
  const elem = document.getElementById(elementId);
  if (!elem) return;

  const content = elem.innerHTML;

  const html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${filename}</title>
      <style>
        @page WordSection1 {
          size: 595.3pt 841.9pt;
          margin: 1.0in 1.0in 1.0in 1.0in;
          mso-header-margin: 35.4pt;
          mso-footer-margin: 35.4pt;
          mso-paper-source: 0;
        }
        div.WordSection1 { page: WordSection1; }
        body {
          font-family: 'Times New Roman', serif;
          font-size: 13pt;
          line-height: 1.5;
          color: #000000;
        }
        h3 {
          font-size: 14pt;
          font-weight: bold;
          text-align: center;
          text-transform: uppercase;
          margin-top: 12pt;
          margin-bottom: 8pt;
        }
        p {
          margin-top: 4pt;
          margin-bottom: 6pt;
          text-align: justify;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10pt;
          margin-bottom: 12pt;
        }
        th, td {
          border: 1pt solid #000000;
          padding: 6pt 8pt;
          font-size: 10.5pt;
          font-family: Arial, sans-serif;
          vertical-align: top;
        }
        th {
          background-color: #E2E8F0;
          font-weight: bold;
          text-align: center;
        }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
        .italic { font-style: italic; }
        .uppercase { text-transform: uppercase; }
        .flex { display: flex; justify-content: space-between; }
        .justify-between { display: flex; justify-content: space-between; }
      </style>
    </head>
    <body>
      <div class="WordSection1">
        ${content}
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + html], {
    type: 'application/msword;charset=utf-8',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const cleanFilename = filename.endsWith('.doc') ? filename : `${filename}.doc`;
  a.download = cleanFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
