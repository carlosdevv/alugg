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

interface ContractReturnPDFProps {
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
    returnNotes?: string;
    code?: number;
    returnedAt?: string;
    shouldChargeFine?: boolean;
    fineDetails?: {
      method: string;
      value: number;
      creditParcelAmount?: number;
    };
  };
}

const paymentMethodNames: Record<string, string> = {
  PIX: "Pix",
  CREDIT_CARD: "Cartão de Crédito",
  DEBIT_CARD: "Cartão de Débito",
  BANK_TRANSFER: "Transferência Bancária",
  CASH: "Dinheiro",
};

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
    width: "50%",
  },
  quantityCol: {
    width: "25%",
  },
  codeCol: {
    width: "10%",
  },
  valueCol: {
    width: "15%",
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
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: "#000",
    marginRight: 5,
  },
  checkedBox: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#000",
    marginRight: 5,
  },
  checkboxLabel: {
    fontSize: 9,
  },
  fineContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
  },
  fineTitle: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 11,
  },
  fineRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  fineLabel: {
    width: "40%",
    fontWeight: "bold",
  },
  fineValue: {
    width: "60%",
  },
});

export function ContractReturnPDF({
  organization,
  customer,
  items,
  contractData,
}: ContractReturnPDFProps) {
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
          <Text style={styles.title}>Protocolo de devolução</Text>
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
            <View style={{ flex: 1 }}></View>
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
              {contractData.returnedAt || ""}
            </Text>
          </View>

          <View style={styles.dateBox}>
            <Text style={styles.dateLabel}>Data marcada de devolução:</Text>
            <Text style={styles.dateValue}>{contractData.returnDate}</Text>
          </View>
        </View>

        {/* Objeto da locação */}
        <View>
          <Text style={styles.notesTitle}>Objeto da locação</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.itemCol]}>Título</Text>
              <Text style={[styles.tableCell, styles.codeCol]}>Código</Text>
              <Text style={[styles.tableCell, styles.quantityCol]}>
                Quantidade
              </Text>
              <Text style={[styles.tableCell, styles.valueCol]}>Valor</Text>
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
              </View>
            ))}
          </View>
        </View>

        {/* Discriminação dos Devolvidos */}
        <View>
          <Text style={styles.notesTitle}>Discriminação dos Devolvidos:</Text>
          <View style={styles.notesContainer}>
            <Text style={styles.notesText}>
              {contractData.returnNotes || ""}
            </Text>
          </View>
        </View>

        {/* Detalhes da multa - visível apenas quando shouldChargeFine é true */}
        {contractData.shouldChargeFine && contractData.fineDetails && (
          <View>
            <Text style={styles.notesTitle}>Detalhes da Multa:</Text>
            <View style={styles.fineContainer}>
              <View style={styles.fineRow}>
                <Text style={styles.fineLabel}>Método de Pagamento:</Text>
                <Text style={styles.fineValue}>
                  {paymentMethodNames[contractData.fineDetails.method] ||
                    contractData.fineDetails.method}
                </Text>
              </View>

              <View style={styles.fineRow}>
                <Text style={styles.fineLabel}>Valor:</Text>
                <Text style={styles.fineValue}>
                  {formatToCurrency(contractData.fineDetails.value)}
                </Text>
              </View>

              {contractData.fineDetails.method === "CREDIT_CARD" &&
                contractData.fineDetails.creditParcelAmount &&
                contractData.fineDetails.creditParcelAmount > 1 && (
                  <View style={styles.fineRow}>
                    <Text style={styles.fineLabel}>Parcelas:</Text>
                    <Text style={styles.fineValue}>
                      {contractData.fineDetails.creditParcelAmount}x
                    </Text>
                  </View>
                )}
            </View>
          </View>
        )}

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
