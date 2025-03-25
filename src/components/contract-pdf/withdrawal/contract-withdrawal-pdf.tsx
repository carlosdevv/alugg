import type { CustomerProps } from "@/http/customers/types";
import type { OrganizationProps } from "@/http/organizations/types";
import { formatToCurrency } from "@/lib/utils";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

interface ContractWithdrawalPDFProps {
  organization?: OrganizationProps;
  customer?: CustomerProps;
  items?: {
    quantity: number;
    value: number;
    name: string;
    price: number;
    code: string;
  }[];
  contractData: {
    eventDate: string;
    withdrawalDate: string;
    returnDate: string;
    withdrawalNotes?: string;
    code?: number;
  };
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    alignItems: "center",
  },
  logoContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 50,
    objectFit: "contain",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 15,
  },
  customerInfo: {
    marginBottom: 15,
  },
  customerName: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 5,
    justifyContent: "space-between",
  },
  infoItem: {
    flexDirection: "row",
    flex: 1,
  },
  infoLabel: {
    fontWeight: "bold",
    marginRight: 5,
  },
  infoValue: {
    flex: 1,
  },
  datesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  dateBox: {
    width: "30%",
  },
  dateLabel: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  dateValue: {
    marginBottom: 5,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  tableCellLast: {
    padding: 5,
  },
  itemCol: {
    width: "30%",
  },
  quantityCol: {
    width: "10%",
  },
  codeCol: {
    width: "10%",
  },
  valueCol: {
    width: "20%",
  },
  assCol: {
    width: "30%",
  },
  notesContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#000",
    padding: 5,
    minHeight: 80,
  },
  notesTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  notesText: {
    fontSize: 9,
  },
  termsContainer: {
    marginBottom: 15,
  },
  termsText: {
    fontSize: 8,
    marginBottom: 5,
    textAlign: "justify",
  },
  signatureContainer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
  },
  signatureLine: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginBottom: 5,
  },
  signatureText: {
    textAlign: "center",
  },
});

export function ContractWithdrawalPDF({
  organization,
  customer,
  items,
  contractData,
}: ContractWithdrawalPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            {organization?.logo && (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={organization.logo} style={styles.logo} />
            )}
          </View>
        </View>

        <View>
          <Text style={styles.title}>Protocolo de Entrega</Text>
        </View>

        {/* Informações do cliente */}
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>
            Nome do cliente: {customer?.name}
          </Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Data do Evento:</Text>
              <Text style={styles.infoValue}>{contractData.eventDate}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>CPF:</Text>
              <Text style={styles.infoValue}>{customer?.document}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>RG:</Text>
              <Text style={styles.infoValue}>{customer?.secondDocument}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Estado:</Text>
              <Text style={styles.infoValue}>{customer?.state}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Cidade:</Text>
              <Text style={styles.infoValue}>{customer?.city}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Bairro:</Text>
              <Text style={styles.infoValue}>{customer?.neighborhood}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Telefone:</Text>
              <Text style={styles.infoValue}>{customer?.phone}</Text>
            </View>
            <View style={{flex: 1}}></View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{customer?.email}</Text>
            </View>
          </View>
        </View>

        {/* Datas */}
        <View style={styles.datesContainer}>
          <View style={styles.dateBox}>
            <Text style={styles.dateLabel}>Data marcada para entrega:</Text>
            <Text style={styles.dateValue}>{contractData.withdrawalDate}</Text>
          </View>

          <View style={styles.dateBox}>
            <Text style={styles.dateLabel}>Data retirada:</Text>
            <Text style={styles.dateValue}>
              {new Date().toLocaleDateString("pt-BR")}
            </Text>
          </View>

          <View style={styles.dateBox}>
            <Text style={styles.dateLabel}>Data de devolução:</Text>
            <Text style={styles.dateValue}>{contractData.returnDate}</Text>
          </View>
        </View>

        {/* Objeto da locação */}
        <View>
          <Text style={styles.notesTitle}>Objeto da locação</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.itemCol]}>Item</Text>
              <Text style={[styles.tableCell, styles.codeCol]}>Código</Text>
              <Text style={[styles.tableCell, styles.quantityCol]}>
                Quantidade
              </Text>
              <Text style={[styles.tableCell, styles.valueCol]}>
                Valor da locação
              </Text>
              <Text style={[styles.tableCellLast, styles.assCol]}>Ass.:</Text>
            </View>

            {items?.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.itemCol]}>
                  {item.name}
                </Text>
                <Text style={[styles.tableCell, styles.codeCol]}>
                  {item.code || ""}
                </Text>
                <Text style={[styles.tableCell, styles.quantityCol]}>
                  {item.quantity}
                </Text>
                <Text style={[styles.tableCell, styles.valueCol]}>
                  {formatToCurrency(item.value)}
                </Text>
                <Text style={[styles.tableCellLast, styles.assCol]}>
                  Ass:________________
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Discriminação dos itens retirados */}
        <View>
          <Text style={styles.notesTitle}>
            Discriminação dos itens retirado:
          </Text>
          <View style={styles.notesContainer}>
            <Text style={styles.notesText}>
              {contractData.withdrawalNotes || ""}
            </Text>
          </View>
        </View>

        {/* Termos e condições */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            DECLARO QUE OS ITENS SUPRA-CITADOS ESTÃO EM PERFEITO ESTADO E ME
            COMPROMETO A
          </Text>
          <Text style={styles.termsText}>
            DEVOLVÊ-LOS CONFORME LOCAÇÃO, DECLARO ESTAR CIENTE QUE EVENTUAIS
            DANOS CAUSADOS NA
          </Text>
          <Text style={styles.termsText}>
            PEÇA LOCADA ESTARÁ SUJEITO AO PAGAMENTO TOTAL OU PARCIAL DO BEM.
            DANOS ESTES SENDO SUJEIRA EXCESSIVA NA PEÇA, RASGADOS, QUEIMADURAS
            EM QUALQUER PARTE DO ITEM MANCHAS (DE ÓLEO, GRAXA, VINHO, TINTA DE
            PLUMAS, COLA, ETC). REFERENTE AO PAGAMENTO PARCIAL O VALOR SERÁ
            DEFINIDO DE ACORDO COM O DANO AO ITEM.
          </Text>
          <Text style={styles.termsText}>
            NO CASO DE DETERIORAÇÃO QUE DE POSSÍVEL REPARAÇÃO, O LOCATÁRIO
            ARCARÁ COM AS DESPESAS PARA ESSE FIM. QUANDO NÃO HOUVER CONDIÇÕES DE
            REPARAÇÃO DO DANO CAUSADO, A CLIENTE PAGARÁ O VALOR DO PRODUTO
            CONFORME O CONTRATO DE LOCAÇÃO, INDEPENDENTEMENTE DO PAGAMENTO DA
            MULTA PREVISTA NAS CLÁUSULAS DESTE CONTRATO.
          </Text>
        </View>

        {/* Assinatura */}
        <View style={styles.signatureContainer}>
          <View>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>Assinatura do Cliente</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
