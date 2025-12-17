import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Étendre jsPDF pour TypeScript
declare module 'jspdf' {
    interface jsPDF {
        lastAutoTable?: any;
    }
}

export class PdfHelper {

    static generatePayslipPdf(r: any, fileName: string = 'fiche_de_paie.pdf'): boolean {
        if (!r) return false;

        const pdf = new jsPDF('p', 'mm', 'a4');

        let currentY = 40;

        // --- En-tête ---
        this.addHeader(pdf, r);

        // --- Revenus ---
        this.addRevenueTable(pdf, r, currentY);
        currentY = pdf.lastAutoTable.finalY + 10;

        // --- Autres avantages ---
        if (r.autresAvantages?.length) {
            this.addAvantagesTable(pdf, r, currentY);
            currentY = pdf.lastAutoTable.finalY + 10;
        }

        // --- Retenues ---
        this.addRetenuesTable(pdf, r, currentY);

        // --- Net à payer ---
        this.addNet(pdf, r);

        pdf.save(fileName);
        return true;
    }

    private static addHeader(pdf: jsPDF, r: any) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(16);
        pdf.text('FICHE DE PAIE', 105, 15, { align: 'center' });

        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Nom : ${r.nom ?? '-'}`, 14, 25);
        pdf.text(`Poste : ${r.poste ?? '-'}`, 14, 32);
        pdf.text(`Mois : Décembre 2025`, 150, 25, { align: 'right' });
    }

    private static addRevenueTable(pdf: jsPDF, r: any, startY: number) {
        autoTable(pdf, {
            startY,
            head: [['Revenus', 'Montant (Ar)']],
            body: [
                ['Salaire de base', r.salaireBase ?? 0],
                ['Prime', r.prime ?? 0],
                ['Heures sup', r.heureSup ?? 0],
                ['Salaire heures sup', r.salaireheureSup ?? 0],
                [
                    'Congés payés',
                    ((r.congesPris ?? 0) * ((r.salaireBase ?? 0) / (r.joursOuvrablesParMois ?? 22))).toFixed(2)
                ],
                ['Salaire brut', r.brut ?? 0]
            ],
            theme: 'grid',
            headStyles: { fillColor: [200, 220, 255], textColor: 0 },
            bodyStyles: { fontSize: 10 }
        });
    }

    private static addAvantagesTable(pdf: jsPDF, r: any, startY: number) {
        autoTable(pdf, {
            startY,
            head: [['Autres avantages', 'Montant (Ar)']],
            body: r.autresAvantages.map((a: any) => [a.nom ?? '-', a.montant ?? 0]),
            theme: 'grid',
            headStyles: { fillColor: [255, 230, 180], textColor: 0 },
            bodyStyles: { fontSize: 10 }
        });
    }

    private static addRetenuesTable(pdf: jsPDF, r: any, startY: number) {
        autoTable(pdf, {
            startY,
            head: [['Retenues', 'Montant (Ar)']],
            body: [
                ['CNAPS (1%)', `-${r.cnaps ?? 0}`],
                ['OSTIE (1%)', `-${r.ostie ?? 0}`],
                ['IRSA', `-${r.irsa ?? 0}`]
            ],
            theme: 'grid',
            headStyles: { fillColor: [255, 180, 180], textColor: 0 },
            bodyStyles: { fontSize: 10 }
        });
    }

    private static addNet(pdf: jsPDF, r: any) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text(
            `Net à payer : ${r.net ?? 0} Ar`,
            14,
            pdf.lastAutoTable.finalY + 15
        );
    }
}
