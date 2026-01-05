import { Button, useMantineTheme, rem } from '@mantine/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  leftSection: IconProp;
  canClose?: boolean;
  iconSize: number;
  handleClick: () => void;
}

const HeaderButton: React.FC<Props> = ({ leftSection, canClose, iconSize, handleClick }) => {
  const theme = useMantineTheme();

  return (
    <Button
      variant="default"
      disabled={canClose === false}
      onClick={handleClick}
      styles={{
        root: {
          border: 'none',
          borderRadius: rem(4),
          flex: '1 15%',
          alignSelf: 'stretch',
          height: 'auto',
          padding: rem(2),
        },
        inner: {
          justifyContent: 'center',
        },
        label: {
          color: canClose === false ? theme.colors.dark[2] : theme.colors.dark[0],
        },
      }}
    >
      <LibIcon icon={leftSection} fontSize={iconSize} />
    </Button>
  );
};

export default HeaderButton;