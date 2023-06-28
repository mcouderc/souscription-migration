import { format } from 'date-fns';
import type { Adresse } from 'open-api-souscription-typescript';

export default function formatDataConsultDevis() {
  const formatDate = (value: any): string => {
    if (value) {
      return format(new Date(value), 'dd/MM/yyyy');
    } else {
      return '';
    }
  };

  const formatPrice = (value: any): string => {
    if (value) {
      const formatedValue = value.toString().split('.');
      formatedValue[0] = formatedValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      return `${formatedValue.join('.')} €`;
    } else {
      return '';
    }
  };

  const formatNumber = (value: number): string => {
    if (value === 0) {
      return '0';
    } else if (value) {
      return value.toString();
    } else {
      return '';
    }
  };

  const formatAmount = (value) => {
    if (value || value === 0) {
      return value.toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'EUR'
      });
    } else {
      return value;
    }
  };

  const formatAmountWithAlreadyEuroSign = (value: string): string | number => {
    if (value.includes('€')) {
      const numberValue = Number(value.replace(/[^0-9.-]+/g, ''));
      return formatAmount(numberValue);
    } else {
      return value;
    }
  };

  const formatAmountContractSummaryDifferentType = (
    value: string | number | Adresse
  ): string | number | Adresse => {
    if (typeof value === 'string') {
      if (value.includes('€')) {
        const numberValue = Number(value.replace(/[^0-9.-]+/g, ''));
        return formatAmount(numberValue);
      } else {
        return value;
      }
    } else {
      return value;
    }
  };

  const preFormatValue = (value: any) => {
    if (typeof value === 'object' || Array.isArray(value)) {
      return value;
    } else {
      if (value === true) {
        return 'Oui';
      } else if (value === false) {
        return 'Non';
      } else {
        return value?.toString();
      }
    }
  };

  const formatAdress = (value): string => {
    if (typeof value === 'object') {
      const adress = [];
      value.adresse1 && adress.push(value.adresse1);
      value.adresse2 && adress.push(value.adresse2);
      value.adresse3 && adress.push(value.adresse3);
      value.codePostal && value.ville && adress.push(`${value.codePostal} ${value.ville}`);
      return adress.join(', ');
    } else {
      return value;
    }
  };

  const textTruncate = (lengthTruncate, text: string): string => {
    return text && text.length > lengthTruncate ? `${text.substring(0, lengthTruncate)} ...` : text;
  };

  return {
    formatDate,
    formatPrice,
    formatNumber,
    formatAdress,
    preFormatValue,
    formatAmount,
    formatAmountWithAlreadyEuroSign,
    formatAmountContractSummaryDifferentType,
    textTruncate
  };
}
