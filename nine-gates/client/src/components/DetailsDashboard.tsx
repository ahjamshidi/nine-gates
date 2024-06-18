import { useState, useEffect } from 'react';
import { fetchCompareJobDetails } from '../helpers/api';
import JobForm from './JobForm';
import '../styles/Dashboard.css';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
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

  return (
    <div className='App'>
      <div>
        <JobForm
          formSubmitHandler={getDetails}
          initialCurrentJob={currentJob}
          initialDesiredJob={desiredJob}
        />
      </div>
      {error && <div className='error-message'>{error}</div>}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          mt: 2,
        }}
      >
        {detailsList?.currentOccupation && detailsList?.desiredOccupation && (
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <h4>{detailsList.currentOccupation.title}</h4>
                  </TableCell>
                  <TableCell>
                    <h4>{detailsList.desiredOccupation.title}</h4>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <p>{detailsList.currentOccupation.description}</p>
                  </TableCell>
                  <TableCell>
                    <p>{detailsList.desiredOccupation.description}</p>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <h5>Alternative Labels</h5>
                  </TableCell>
                  <TableCell>
                    <h5>Alternative Labels</h5>
                  </TableCell>
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
                  <TableCell>
                    <h5>Essential Skills</h5>
                    <SkillsList
                      skillsList={detailsList.currentOccupation.essentialSkills}
                      onSkillClick={handleSkillClick}
                    />
                  </TableCell>
                  <TableCell>
                    <h5>Essential Skills</h5>
                    <SkillsList
                      skillsList={detailsList.desiredOccupation.essentialSkills}
                      onSkillClick={handleSkillClick}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <h5>Optional Skills</h5>
                    <SkillsList
                      skillsList={detailsList.currentOccupation.optionalSkills}
                      onSkillClick={handleSkillClick}
                    />
                  </TableCell>
                  <TableCell>
                    <h5>Optional Skills</h5>
                    <SkillsList
                      skillsList={detailsList.desiredOccupation.optionalSkills}
                      onSkillClick={handleSkillClick}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        )}
      </Box>
      <Box sx={{ mt: 2 }}>
        {detailsList?.currentOccupation && detailsList?.desiredOccupation && (
          <div className='skills-section'>
            <h5>Matched Skills</h5>
            <SkillsList
              skillsList={detailsList.commonEssentialSkills}
              onSkillClick={handleSkillClick}
            />
            <SkillsList
              skillsList={detailsList.commonOptionalSkills}
              onSkillClick={handleSkillClick}
            />
            <h5>Missing Skills</h5>
            <SkillsList
              skillsList={detailsList.missingEssentialSkills}
              onSkillClick={handleSkillClick}
            />
            <SkillsList
              skillsList={detailsList.missingOptionalSkills}
              onSkillClick={handleSkillClick}
            />
          </div>
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
