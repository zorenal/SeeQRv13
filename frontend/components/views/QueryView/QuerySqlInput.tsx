/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
import { ButtonGroup, Button, Tooltip } from '@mui/material';
import styled from 'styled-components';
import { format } from 'sql-formatter';

// import 'codemirror/lib/codemirror.css'; // Styline
// import 'codemirror/mode/sql/sql'; // Language (Syntax Highlighting)
// import 'codemirror/theme/lesser-dark.css'; // Theme
import CodeMirror from '@uiw/react-codemirror';
import { dracula } from '@uiw/codemirror-theme-dracula';
// import { sql } from '@codemirror/lang-sql'

const Container = styled.div`
  position: relative;
`;

const SquareBtn = styled(Button)`
  padding: 5px;
`;

const Toolbar = styled.div`
  position: absolute;
  z-index: 1000;
  top: 5px;
  right: 23px;
  opacity: 0.3;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

interface QuerySqlInputProps {
  sql: string;
  onChange: (newSql: string) => void;
  runQuery: () => void;
}

const QuerySqlInput = ({ sql, onChange, runQuery }: QuerySqlInputProps) => {
  const formatQuery = () => {
    const formatted = format(sql, { language: 'postgresql', uppercase: true });
    onChange(formatted);
  };

  // Codemirror module configuration options
  const options = {
    lineNumbers: true,
    mode: 'sql',
    theme: 'lesser-dark',
    extraKeys: {
      'Ctrl-Enter': runQuery,
      'Ctrl-F': formatQuery,
    },
  };
  return (
    <Container>
      <Toolbar>
        <ButtonGroup variant="contained">
          <Tooltip title="Auto-Format Query">
            <SquareBtn onClick={formatQuery}>
              <FormatPaintIcon />
            </SquareBtn>
          </Tooltip>
        </ButtonGroup>
      </Toolbar>
      <CodeMirror onChange={onChange} theme={dracula} height='300px' value={sql} />
    </Container>
  );
};

export default QuerySqlInput;
