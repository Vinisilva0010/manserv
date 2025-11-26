'use client'

import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'

// Estilos do PDF (Parecido com CSS, mas para impressão)
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
  },
  border: {
    border: '4px solid #00ff9d', // Verde Manserv
    height: '100%',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textTransform: 'uppercase',
    color: '#1e293b',
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 30,
  },
  studentName: {
    fontSize: 32,
    color: '#0f172a',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  courseTitle: {
    fontSize: 20,
    color: '#059669', // Emerald
    marginBottom: 40,
    textAlign: 'center',
  },
  text: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 5,
    color: '#334155',
  },
  footer: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderTop: '1px solid #cbd5e1',
    paddingTop: 10,
  },
  code: {
    fontSize: 8,
    color: '#94a3b8',
    marginTop: 20,
  }
})

interface CertificateProps {
  studentName: string
  courseTitle: string
  completedDate: string
  score: number
}

// O Componente do Documento
export function CertificateDocument({ studentName, courseTitle, completedDate, score }: CertificateProps) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.border}>
          {/* Título */}
          <Text style={styles.header}>Certificado de Conclusão</Text>
          <Text style={styles.subHeader}>A Manserv Industrial certifica que</Text>

          {/* Nome do Aluno */}
          <Text style={styles.studentName}>{studentName}</Text>

          <Text style={styles.subHeader}>concluiu com êxito o treinamento de segurança:</Text>

          {/* Nome do Curso */}
          <Text style={styles.courseTitle}>{courseTitle}</Text>

          {/* Detalhes */}
          <Text style={styles.text}>Data de Conclusão: {completedDate}</Text>
          <Text style={styles.text}>Aproveitamento no Desafio: {score} pontos</Text>
          <Text style={styles.text}>Carga Horária: 40 horas</Text>

          {/* Rodapé e Assinaturas */}
          <View style={styles.footer}>
            <View>
              <Text style={{ fontSize: 10 }}>_________________________</Text>
              <Text style={{ fontSize: 10 }}>Diretoria de Segurança</Text>
            </View>
            <View>
              <Text style={{ fontSize: 10 }}>_________________________</Text>
              <Text style={{ fontSize: 10 }}>Assinatura do Aluno</Text>
            </View>
          </View>

          {/* Código de Validação */}
          <Text style={styles.code}>
            Autenticidade garantida por Manserv Safety Tech. ID: {Math.random().toString(36).substring(7).toUpperCase()}
          </Text>
        </View>
      </Page>
    </Document>
  )
}