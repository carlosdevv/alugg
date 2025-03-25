import type { CustomerProps } from "@/http/customers/types";
import type { ItemProps } from "@/http/items/types";
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

interface ContractInvoicePDFProps {
  organization?: OrganizationProps;
  customer?: CustomerProps;
  items?: (ItemProps & {
    quantity: number;
    isBonus?: boolean;
    baseValue?: number;
    discount?:
      | {
          value: number;
          mode: "currency" | "percent";
        }
      | number;
    discountMode?: "currency" | "percent";
    finalValue?: number;
  })[];
  totalValue: number;
  formValues: any;
  seller?: {
    name: string;
  };
  code?: number;
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
  contractNumber: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 5,
  },
  companyInfo: {
    marginBottom: 10,
    textAlign: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  section: {
    marginTop: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    marginRight: 5,
  },
  value: {
    flex: 1,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
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
  codeCol: {
    width: "10%",
  },
  quantityCol: {
    width: "10%",
  },
  valueCol: {
    width: "15%",
  },
  discountCol: {
    width: "15%",
  },
  rentCol: {
    width: "15%",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 5,
  },
  paymentSection: {
    marginTop: 10,
    marginBottom: 10,
  },
  notes: {
    marginTop: 10,
    marginBottom: 10,
  },
  dates: {
    marginTop: 10,
    marginBottom: 10,
  },
  clauses: {
    marginTop: 10,
  },
  clause: {
    marginBottom: 5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  gridItem: {
    width: "33%",
    marginBottom: 5,
  },
});

export function ContractInvoicePDF({
  organization,
  customer,
  items,
  totalValue,
  formValues,
  seller,
  code,
}: ContractInvoicePDFProps) {
  const formatDiscount = (item: any) => {
    if (
      item.discount &&
      typeof item.discount === "object" &&
      "value" in item.discount &&
      "mode" in item.discount
    ) {
      return item.discount.mode === "percent"
        ? `${item.discount.value}%`
        : formatToCurrency(item.discount.value);
    } else if (typeof item.discount === "number" && item.discountMode) {
      return item.discountMode === "percent"
        ? `${item.discount}%`
        : formatToCurrency(item.discount);
    }
    return formatToCurrency(item.discount || 0);
  };

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

        {/* Informações da empresa */}
        <View style={styles.companyInfo}>
          <Text>{organization?.address || ""}</Text>
          <Text>
            {organization?.neighborhood || ""} - {organization?.city || ""}/
            {organization?.state || ""}
          </Text>
          <Text>{organization?.phone || ""}</Text>
        </View>

        {/* Título do contrato */}
        <View style={styles.title}>
          <Text>CONTRATO DE LOCAÇÃO</Text>
        </View>

        {/* Número do contrato */}
        <View>
          <Text style={styles.contractNumber}>Nº: {code}</Text>
        </View>

        {/* Introdução */}
        <View style={styles.section}>
          <Text>
            Os SIGNATÁRIO, QUE CONTRATAM NAS QUALIDADES NESTE CONTRATO, TÊM
            ENTRE SI, AJUSTADA A PRESENTE LOCAÇÃO COM PRESTAÇÃO DE SERVIÇO,
            MEDIANTE AS SEGUINTES CLÁUSULAS E CONDIÇÕES:
          </Text>
        </View>

        {/* Informações do locador e locatário */}
        <View style={styles.section}>
          <Text style={styles.row}>
            <Text style={styles.label}>01 - LOCADOR: </Text>
            <Text style={styles.value}>
              {organization?.name.toUpperCase() || ""} - CNPJ:{" "}
              {organization?.cnpj || ""}
            </Text>
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>02 - LOCATÁRIO: </Text>
            <Text style={styles.value}>
              {customer?.name.toUpperCase() || ""}
            </Text>
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>Atendente que fez a locação: </Text>
            <Text style={styles.value}>
              {seller ? seller.name.toUpperCase() : ""}
            </Text>
          </Text>
        </View>

        {/* Data do evento */}
        <View style={styles.section}>
          <Text style={styles.row}>
            <Text style={styles.label}>DATA DO EVENTO: </Text>
            <Text style={styles.value}>{formValues.eventDate || ""}</Text>
          </Text>
        </View>

        {/* Grid de informações do cliente */}
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.row}>
              <Text style={styles.label}>CPF: </Text>
              <Text style={styles.value}>{customer?.document || ""}</Text>
            </Text>
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.row}>
              <Text style={styles.label}>RG: </Text>
              <Text style={styles.value}>{customer?.secondDocument || ""}</Text>
            </Text>
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.row}>
              <Text style={styles.label}>Estado: </Text>
              <Text style={styles.value}>{customer?.state || ""}</Text>
            </Text>
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.row}>
              <Text style={styles.label}>Cidade: </Text>
              <Text style={styles.value}>{customer?.city || ""}</Text>
            </Text>
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.row}>
              <Text style={styles.label}>Bairro: </Text>
              <Text style={styles.value}>{customer?.neighborhood || ""}</Text>
            </Text>
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.row}>
              <Text style={styles.label}>Endereço: </Text>
              <Text style={styles.value}>{customer?.address || ""}</Text>
            </Text>
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.row}>
              <Text style={styles.label}>CEP: </Text>
              <Text style={styles.value}>{customer?.zipcode || ""}</Text>
            </Text>
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.row}>
              <Text style={styles.label}>Telefone: </Text>
              <Text style={styles.value}>{customer?.phone || ""}</Text>
            </Text>
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.row}>
              <Text style={styles.label}>Email: </Text>
              <Text style={styles.value}>{customer?.email || ""}</Text>
            </Text>
          </View>
        </View>

        {/* Objeto da locação */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>03 - Objeto da locação</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.itemCol]}>Item</Text>
              <Text style={[styles.tableCell, styles.codeCol]}>Código</Text>
              <Text style={[styles.tableCell, styles.quantityCol]}>Qtd</Text>
              <Text style={[styles.tableCell, styles.valueCol]}>
                Valor do Objeto
              </Text>
              <Text style={[styles.tableCell, styles.discountCol]}>
                Desconto
              </Text>
              <Text style={[styles.tableCellLast, styles.rentCol]}>
                Valor da locação
              </Text>
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
                  {formatToCurrency(item.objectPrice)}
                </Text>
                <Text style={[styles.tableCell, styles.discountCol]}>
                  {formatDiscount(item)}
                </Text>
                <Text style={[styles.tableCellLast, styles.rentCol]}>
                  {formatToCurrency(item.finalValue || 0)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Valor da locação */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>04 - Valor da locação</Text>
          <View style={styles.totalRow}>
            <Text style={styles.label}>Total da locação:</Text>
            <Text style={styles.value}>{formatToCurrency(totalValue)}</Text>
          </View>
        </View>

        {/* Forma de pagamento - exibindo todos os pagamentos */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>5 - Forma de pagamento</Text>
          {formValues.paymentMethod?.map((payment: any, index: number) => (
            <Text key={index}>
              {payment.method === "CREDIT_CARD"
                ? "Cartão de Crédito"
                : payment.method === "DEBIT_CARD"
                ? "Cartão de Débito"
                : payment.method === "PIX"
                ? "PIX"
                : payment.method === "BANK_TRANSFER"
                ? "Transferência Bancária"
                : payment.method === "CASH"
                ? "Dinheiro"
                : payment.method}{" "}
              {formatToCurrency(payment.value)}{" "}
              {payment.method === "CREDIT_CARD"
                ? `Parcela ${payment.creditParcelAmount}`
                : ""}{" "}
              {payment.paymentDate} {payment.isPaid ? "(PAGO)" : ""}
            </Text>
          ))}
        </View>

        {/* Observações */}
        <View style={styles.notes}>
          <Text style={styles.sectionTitle}>Ajustes / Observações:</Text>
          <Text>{formValues.additionalInformation?.toUpperCase() || ""}</Text>
        </View>

        {/* Datas */}
        <View style={styles.dates}>
          <Text style={styles.row}>
            <Text style={styles.label}>Data de retirada: </Text>
            <Text style={styles.value}>{formValues.withdrawalDate || ""}</Text>
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>Data de devolução: </Text>
            <Text style={styles.value}>{formValues.returnDate || ""}</Text>
          </Text>
        </View>

        {/* Cláusulas */}
        <View style={styles.clauses}>
          <Text style={styles.clause}>
            08 – O locador é proprietário do traje descrito na cláusula 3 deste
            instrumento e o dá em locação ao locatário para uso próprio ou de
            terceiros por ele indicado.
          </Text>
          <Text style={styles.clause}>
            09 – A partir da data da assinatura deste contrato o Contratante se
            compromete a realizar os ajustes necessários na semana do evento,
            salvo sábado e após às 17:00 horas de segunda-feira a sexta-feira
            que não fazemos provas de vestido, concedendo assim prazo hábil ao
            Locador para devidos ajustes.
          </Text>
          <Text style={styles.clause}>10 – CUIDADOS GERAIS:</Text>
          <Text style={styles.clause}>
            a) Delicadeza dos tecidos, rendas, pedrarias e acessórios utilizados
            na confecção do traje, impedem qualquer tipo de lavação, requerendo
            cuidados especiais que devem ser observados com muito zelo pelo
            locatário, que declara ter procedido neste ato à vistoria do traje
            recebendo-o em perfeito estado e obrigando-se ainda a:
          </Text>
        </View>
      </Page>
    </Document>
  );
}
