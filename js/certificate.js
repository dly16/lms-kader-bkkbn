// ============================================
// CERTIFICATE.JS - Certificate Generation
// Uses jsPDF loaded via CDN in index.html
// ============================================

const Certificate = {
  getTemplate() {
    return DB.get(DB.KEYS.CERT_TEMPLATE);
  },

  saveTemplate(templateData) {
    DB.set(DB.KEYS.CERT_TEMPLATE, templateData);
  },

  generate(kaderName, courseName, score, certNumber, completionDate) {
    const template = this.getTemplate();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    if (template && template.imageData) {
      doc.addImage(template.imageData, 'JPEG', 0, 0, 297, 210);
      // Overlay name on template
      const nameX = template.nameX || 148.5;
      const nameY = template.nameY || 105;
      const nameSize = template.nameSize || 28;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(nameSize);
      doc.setTextColor(template.nameColor || '#1a1a2e');
      doc.text(kaderName, nameX, nameY, { align: 'center' });

      // Course name
      if (template.showCourse !== false) {
        const courseY = template.courseY || (nameY + 20);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.text(courseName, nameX, courseY, { align: 'center' });
      }

      // Certificate number
      if (template.showCertNo !== false) {
        doc.setFontSize(9);
        doc.setTextColor('#666');
        doc.text(`No: ${certNumber}`, template.certNoX || 148.5, template.certNoY || 190, { align: 'center' });
      }
    } else {
      // Default template
      this._drawDefaultTemplate(doc, kaderName, courseName, score, certNumber, completionDate);
    }

    // QR Code
    try {
      const qrCanvas = document.createElement('canvas');
      new QRCode(qrCanvas, {
        text: `LMS-BKKBN-SULBAR|${certNumber}|${kaderName}|${courseName}|${score}`,
        width: 200, height: 200, colorDark: '#1B4F72', colorLight: '#ffffff'
      });
      setTimeout(() => {
        try {
          const qrData = qrCanvas.querySelector('canvas')?.toDataURL('image/png') || qrCanvas.toDataURL('image/png');
          doc.addImage(qrData, 'PNG', 255, 168, 30, 30);
        } catch(e) {}
        doc.save(`Sertifikat_${kaderName.replace(/\s+/g, '_')}_${courseName.replace(/\s+/g, '_')}.pdf`);
      }, 300);
    } catch(e) {
      doc.save(`Sertifikat_${kaderName.replace(/\s+/g, '_')}_${courseName.replace(/\s+/g, '_')}.pdf`);
    }
  },

  _drawDefaultTemplate(doc, kaderName, courseName, score, certNumber, completionDate) {
    // Background gradient simulation
    doc.setFillColor(15, 32, 65);
    doc.rect(0, 0, 297, 210, 'F');
    
    // Inner white area
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(15, 12, 267, 186, 4, 4, 'F');

    // Top accent bar
    doc.setFillColor(27, 79, 114);
    doc.rect(15, 12, 267, 8, 'F');
    doc.setFillColor(243, 156, 18);
    doc.rect(15, 20, 267, 3, 'F');

    // Bottom accent bar
    doc.setFillColor(243, 156, 18);
    doc.rect(15, 192, 267, 3, 'F');
    doc.setFillColor(27, 79, 114);
    doc.rect(15, 195, 267, 3, 'F');

    // Corner decorations
    doc.setDrawColor(27, 79, 114);
    doc.setLineWidth(0.5);
    doc.line(25, 30, 45, 30); doc.line(25, 30, 25, 50);
    doc.line(272, 30, 252, 30); doc.line(272, 30, 272, 50);
    doc.line(25, 185, 45, 185); doc.line(25, 185, 25, 165);
    doc.line(272, 185, 252, 185); doc.line(272, 185, 272, 165);

    // Header
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(27, 79, 114);
    doc.text('PERWAKILAN BKKBN PROVINSI SULAWESI BARAT', 148.5, 40, { align: 'center' });

    // Title
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(27, 79, 114);
    doc.text('SERTIFIKAT', 148.5, 62, { align: 'center' });

    // Subtitle
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Diberikan kepada:', 148.5, 75, { align: 'center' });

    // Recipient name
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(243, 156, 18);
    doc.text(kaderName, 148.5, 92, { align: 'center' });

    // Decorative line
    doc.setDrawColor(243, 156, 18);
    doc.setLineWidth(0.8);
    const nameWidth = doc.getTextWidth(kaderName);
    doc.line(148.5 - nameWidth/2 - 10, 96, 148.5 + nameWidth/2 + 10, 96);

    // Description
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text('Telah berhasil menyelesaikan pelatihan:', 148.5, 108, { align: 'center' });

    // Course name
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(27, 79, 114);
    const courseLines = doc.splitTextToSize(courseName, 200);
    doc.text(courseLines, 148.5, 120, { align: 'center' });

    // Score & date
    const yAfterCourse = 120 + (courseLines.length * 8);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(`Dengan nilai: ${score}/100  |  Tanggal: ${completionDate}`, 148.5, yAfterCourse + 5, { align: 'center' });

    // Signatures
    const sigY = 155;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Kepala Perwakilan', 80, sigY, { align: 'center' });
    doc.setLineWidth(0.3);
    doc.line(45, sigY + 18, 115, sigY + 18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    doc.text('Kepala Perwakilan BKKBN', 80, sigY + 24, { align: 'center' });
    doc.text('Prov. Sulawesi Barat', 80, sigY + 30, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Koordinator Pelatihan', 217, sigY, { align: 'center' });
    doc.line(182, sigY + 18, 252, sigY + 18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    doc.text('Koordinator Pelatihan', 217, sigY + 24, { align: 'center' });

    // Certificate number
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text(`No. Sertifikat: ${certNumber}`, 148.5, 192, { align: 'center' });
  },

  generateCertNumber(courseId, kaderId) {
    const year = new Date().getFullYear();
    const seq = Math.floor(Math.random() * 9000) + 1000;
    return `BKKBN-SULBAR/${year}/RDK/${seq}`;
  }
};
