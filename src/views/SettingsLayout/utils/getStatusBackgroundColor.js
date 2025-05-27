 export const StatusBgColor = (status) => {
    if(!status) return '#000000'; //  if no status

    switch (status.toLowerCase()) {
      case 'active':
        return '#11B8A4'
      case 'inactive':
        return '#D00026'
      case 'not activated':
        return '#808080'
      case 'paid':
        return '#0C7B93'
      case 'free':
        return '#999999'
      default:
        break;
    }
  }

