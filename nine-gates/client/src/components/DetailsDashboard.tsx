import { useState, useEffect } from 'react';
import { fetchCompareJobDetails } from '../helpers/api';
import JobForm from './JobForm';
import '../styles/Dashboard.css';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Card from '@mui/material';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
} from '@mui/material';
import { Skill } from '../types/types';
import SkillsList from './SkillsList';
import { styled } from '@mui/material/styles';
import '../styles/Dashboard.css';
interface DetailsDashboardProps {
  currentJob: string;
  desiredJob: string;
}

const DetailsDashboard = ({
  currentJob,
  desiredJob,
}: DetailsDashboardProps) => {
  const [detailsList, setDetailsList] = useState<any>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentJob && desiredJob) {
      getDetails(currentJob, desiredJob);
    }
  }, [currentJob, desiredJob]);

  const getDetails = async (currentJob: string, desiredJob: string) => {
    const details = await fetchCompareJobDetails(currentJob, desiredJob);
    if (details.data?.results) {
      setDetailsList(details.data.results);
      setError(null);
    } else {
      setError(
        details.error || 'An error occurred while fetching the details.'
      );
    }
  };

  const handleSkillClick = (skill: Skill): void => {
    try {
      setSelectedSkill(skill);
    } catch (err) {
      console.error(err);
      setError('CANT GET the skill description.');
    }
  };
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.info.light,
    color: 'white',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: 16,
    border: '0!important',
    textTransform: 'uppercase',
  }));
  return (
    <div className="App">
      <div>
        <JobForm
          formSubmitHandler={getDetails}
          initialCurrentJob={currentJob}
          initialDesiredJob={desiredJob}
        />
      </div>
      {error && <div className="error-message">{error}</div>}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          mt: 2,
        }}
      >
        {detailsList?.currentOccupation && detailsList?.desiredOccupation && (
          <>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <Table>
                <TableBody>
                  <TableRow>
                    <StyledTableCell>
                      {detailsList.currentOccupation.title}
                    </StyledTableCell>
                    <StyledTableCell>
                      {detailsList.desiredOccupation.title}
                    </StyledTableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      {detailsList.currentOccupation.description}
                    </TableCell>
                    <TableCell>
                      {detailsList.desiredOccupation.description}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell colSpan={2}>
                      Alternative Labels
                    </StyledTableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <ul>
                        {detailsList.currentOccupation.alternativeLabel.map(
                          (label: string, index: number) => (
                            <li key={index}>{label}</li>
                          )
                        )}
                      </ul>
                    </TableCell>
                    <TableCell>
                      <ul>
                        {detailsList.desiredOccupation.alternativeLabel.map(
                          (label: string, index: number) => (
                            <li key={index}>{label}</li>
                          )
                        )}
                      </ul>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell colSpan={2}>
                      Essential Skills
                    </StyledTableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <SkillsList
                        skillsList={
                          detailsList.currentOccupation.essentialSkills
                        }
                        onSkillClick={handleSkillClick}
                      />
                    </TableCell>
                    <TableCell>
                      <SkillsList
                        skillsList={
                          detailsList.desiredOccupation.essentialSkills
                        }
                        onSkillClick={handleSkillClick}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell colSpan={2}>
                      Optional Skills
                    </StyledTableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <SkillsList
                        skillsList={
                          detailsList.currentOccupation.optionalSkills
                        }
                        onSkillClick={handleSkillClick}
                      />
                    </TableCell>
                    <TableCell>
                      <SkillsList
                        skillsList={
                          detailsList.desiredOccupation.optionalSkills
                        }
                        onSkillClick={handleSkillClick}
                      />
                    </TableCell>
                  </TableRow>
                  {detailsList.commonEssentialSkills.length > 0 && (
                    <>
                      <TableRow>
                        <StyledTableCell colSpan={2}>
                          Matched Essential Skills
                        </StyledTableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={2}>
                          <SkillsList
                            skillsList={detailsList.commonEssentialSkills}
                            onSkillClick={handleSkillClick}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <StyledTableCell colSpan={2}>
                          Matched Optional Skills
                        </StyledTableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={2}>
                          <SkillsList
                            skillsList={detailsList.commonOptionalSkills}
                            onSkillClick={handleSkillClick}
                          />
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                  <TableRow>
                    <StyledTableCell colSpan={2}>
                      Missing Essential Skills
                    </StyledTableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}>
                      <SkillsList
                        skillsList={detailsList.missingEssentialSkills}
                        onSkillClick={handleSkillClick}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell colSpan={2}>
                      Missing Optional Skills
                    </StyledTableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}>
                      <SkillsList
                        skillsList={detailsList.missingOptionalSkills}
                        onSkillClick={handleSkillClick}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </>
        )}
      </Box>

      <Dialog open={!!selectedSkill} onClose={() => setSelectedSkill(null)}>
        <DialogTitle>{selectedSkill ? selectedSkill.title : ''}</DialogTitle>
        <DialogContent>
          {selectedSkill ? selectedSkill.description : ''}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetailsDashboard;
