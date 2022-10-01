// ----------------------------------------------------------------------

export default function Button(theme) {
    return {
        MuiButton: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        boxShadow: 'none'
                    }
                },
                sizeLarge: {
                    height: 48
                },
               /* modalInherit: {
                    color: theme.palette.blue[800],
                    boxShadow: theme.customShadows.z8,
                    '&:hover': {
                        backgroundColor: theme.palette.blue[400]
                    }
                },
                modalPrimary:{
                    boxShadow: theme.customShadows.primary
                },*/
                containedInherit: {
                    color: theme.palette.grey[800],
                    boxShadow: theme.customShadows.z8,
                    '&:hover': {
                        backgroundColor: theme.palette.grey[400]
                    }
                },
                containedPrimary: {
                    boxShadow: theme.customShadows.primary
                },
                outlinedInherit: {
                    border: `1px solid ${theme.palette.grey[500_32]}`,
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover
                    }
                },
                containedError: {
                    boxShadow: theme.customShadows.error
                },


                textInherit: {
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover
                    }
                }
            }
        }
    };
}
