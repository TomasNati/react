import styled from 'styled-components'

export const StyledContainer = styled.div`
  heigth: 100vw;
  padding: 20px;
  background: #83A4D4;
  background: linear-gradient(to left, #B6FBFF, #83A4d4)
`;

export const StyledHeadlinePrimary = styled.h1`
  font-size: 48px;
  font-weight: 300;
  letter-spacing: 2px;
`;

export const StyledItem = styled.li`
    display: flex;
    align-items: center;
    padding-bottom: 5px;
`;


interface ColumnProps {
    width: string
}
export const StyledColumn = styled.span<ColumnProps>`
    padding: 0 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    a {
        color: inherit
    }
    width: ${({ width }) => width};
`;

export const StyledButton = styled.button`
    background: transparent;
    border: 1px solid #171212;
    padding: 5px;
    cursor: pointer;
    transition: all 0.1s ease-in;
    &:hover {
        background: #171212;
        color: #FFFFFF
    }
`;

export const StyleButtonSmall = styled(StyledButton)`
    padding: 5px;
`;

export const StyleButtonLarge = styled(StyledButton)`
    padding: 10px;
`;

export const StyledSearchForm = styled.form`
    padding: 10px 0 20px 0;
    display: flex;
    align-items: baseline;
    gap: 5px
`;

export const StyledLabel = styled.label`
    border-top: 1px solid #171212;
    border-left: 1px solid #171212;
    padding-left: 5px;
    font-size: 24px;
`;

export const StyledInput = styled.input`
    border: none;
    border-bottom: 1px solid #171212;
    background-color: transparent;
    font-size: 24px;
`;

